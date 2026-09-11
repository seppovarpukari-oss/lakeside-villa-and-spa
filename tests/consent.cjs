// Run: node tests/consent.cjs (requires Playwright and Chrome).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root, {recursive:true}).filter(f => f.endsWith('.html') && f !== '404.html');
const key = 'tlvs-consent-v1';
const tag = 'G-BD1V798REN';
(async () => {
  assert.equal(files.length, 84);
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    assert.equal((html.match(/<script defer src="(?:\.\.\/)?assets\/site-consent.js"><\/script>/g)||[]).length, 1, file);
    assert(!/googletagmanager|google-analytics|gtag\(/.test(html), file);
  }
  const server = http.createServer((req,res) => {
    const filename = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    const target = filename.endsWith(path.sep) ? filename + 'index.html' : filename;
    if (!target.startsWith(root+path.sep)) {res.writeHead(403).end();return;}
    fs.readFile(target,(err,data)=> {
      if(err){res.writeHead(404).end();return;}
      const type = {'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml'}[path.extname(target)];
      res.writeHead(200, {'Content-Type':type || 'application/octet-stream'});res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  const origin = 'http://127.0.0.1:'+server.address().port;
  let browser;
  try {
    browser = await chromium.launch({channel:'chrome',headless:true});
    for (const lang of ['', 'fi/', 'de/']) for (const mobile of [false,true]) {
      const context = await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile});
      // Stub only Google's measurement script: exercise our state machine without recording test visits.
      let requests = 0;
      await context.route('https://www.googletagmanager.com/gtag/js*', route=> { requests++; return route.fulfill({contentType:'text/javascript',body:''}); });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
      await page.goto(origin+'/'+lang+'index.html', {waitUntil:'networkidle'});
      assert(await page.locator('#tlvs-consent').isVisible());
      assert.equal(requests,0);
      assert.deepEqual(await page.evaluate(()=>({...window.dataLayer[0][2]})),{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      const bounds = await page.locator('#tlvs-consent').boundingBox();
      assert(bounds.x>=0 && bounds.y>=0 && bounds.x+bounds.width<= (mobile?390:1440));
      const rejectBounds = await page.locator('#tlvs-consent-reject').boundingBox();
      assert(rejectBounds.y + rejectBounds.height <= (mobile ? 844 : 1000));
      if(process.env.CONSENT_SCREENSHOTS) {
        fs.mkdirSync(process.env.CONSENT_SCREENSHOTS,{recursive:true});
        await page.screenshot({path:path.join(process.env.CONSENT_SCREENSHOTS,(lang.slice(0,-1)||'en')+'-'+(mobile?'mobile':'desktop')+'.png')});
      }
      await page.locator('#tlvs-consent-reject').click();
      await page.goto(origin+'/'+lang+'the-villa.html',{waitUntil:'networkidle'});
      assert(!await page.locator('#tlvs-consent').isVisible());
      assert.equal(requests,0);
      await page.locator('footer [data-i18n="cookies"]').click();
      assert(await page.locator('#tlvs-consent').isVisible());
      await page.locator('#tlvs-consent-accept').click();
      await page.waitForFunction(()=>document.querySelector('script[src*="gtag/js"]'));
      await page.waitForTimeout(100);
      assert.equal(requests,1);
      const commands = await page.evaluate(()=>window.dataLayer.map(x=>Array.from(x)));
      assert.equal(commands.filter(x=>x[0]==='config').length,1);
      assert.equal(commands.find(x=>x[0]==='config')[1],tag);
      const update = commands.filter(x=>x[0]==='consent').at(-1)[2];
      assert.equal(update.analytics_storage,'granted');
      assert.equal(update.ad_user_data,'denied');
      await page.locator('footer [data-i18n="cookies"]').click();
      await page.locator('#tlvs-consent-accept').click();
      assert.equal(requests,1);
      await page.goto(origin+'/fi/location.html',{waitUntil:'networkidle'});
      assert(!await page.locator('#tlvs-consent').isVisible());
      assert.equal(requests,2);
      await context.addCookies([{name:'_ga',value:'test',url:origin}]);
      await page.locator('footer [data-i18n="cookies"]').click();
      await page.locator('#tlvs-consent-reject').click();
      assert(await page.evaluate(id=>window['ga-disable-'+id],tag));
      assert(!(await context.cookies()).some(c=>c.name==='_ga'));
      await page.goto(origin+'/de/enquire.html',{waitUntil:'networkidle'});
      assert.equal(requests,2);
      assert(!await page.locator('#tlvs-consent').isVisible());
      // Corrupt and expired choices fail closed.
      for(const value of ['broken', JSON.stringify({version:1,analytics:true,savedAt:1})]) {
        await page.evaluate(([k,v])=>localStorage.setItem(k,v),[key,value]);
        await page.reload({waitUntil:'networkidle'});
        assert(await page.locator('#tlvs-consent').isVisible());
        assert.equal(requests,2);
      }
      assert.deepEqual(errors,[]);
      console.log('PASS',lang||'en/',mobile?'mobile':'desktop','default/reject/accept/reopen/persistence/revoke/invalid/expiry; no console errors');
      await context.close();
    }
    const syncContext = await browser.newContext({viewport:{width:320,height:568}});
    await syncContext.route('https://www.googletagmanager.com/gtag/js*', route => route.fulfill({contentType:'text/javascript',body:''}));
    const first = await syncContext.newPage();
    const second = await syncContext.newPage();
    await first.goto(origin+'/index.html');
    await second.goto(origin+'/fi/index.html');
    await first.locator('#tlvs-consent-accept').click();
    await second.waitForFunction(()=>document.querySelector('#tlvs-consent').hidden);
    assert.equal(await second.locator('script[src*="gtag/js"]').count(),1);
    await first.locator('footer [data-i18n="cookies"]').click();
    await first.locator('#tlvs-consent-reject').click();
    await second.waitForFunction(()=>window['ga-disable-G-BD1V798REN']===true);
    for(const lang of ['', 'fi/', 'sv/', 'de/', 'fr/', 'es/', 'nl/', 'zh-cn/', 'da/', 'no/', 'et/', 'it/']) {
      await first.goto(origin+'/'+lang+'index.html');
      await first.locator('footer [data-i18n="cookies"]').click();
      const heading = await first.locator('#tlvs-consent-title').textContent();
      assert(heading && (lang==='' || heading!=='Cookie preferences'));
      const rect = await first.locator('#tlvs-consent').boundingBox();
      assert(rect.x>=0 && rect.x+rect.width<=320 && rect.y>=0 && rect.y+rect.height<=568);
    }
    await syncContext.close();
    console.log('PASS cross-tab accept/revoke and 12 languages at 320px');
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.addInitScript(()=>{Storage.prototype.getItem=function(){throw Error('blocked')};Storage.prototype.setItem=function(){throw Error('blocked')};});
    await page.goto(origin+'/fi/index.html');
    await page.locator('#tlvs-consent-reject').click();
    assert(!await page.locator('#tlvs-consent').isVisible());
    await context.close();
    console.log('PASS 84 includes; blocked storage remains usable');
  } finally {if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
