const VILLA_WORDS={"en": {"title": "Villa Assistant", "welcome": "How can I help?", "try": "Try Villa Assistant", "launch": "Ask about the villa", "close": "Close assistant"}, "fi": {"title": "Villa-assistentti", "welcome": "Miten voin auttaa?", "try": "Kokeile Villa-assistenttia", "launch": "Kysy huvilasta", "close": "Sulje assistentti"}, "sv": {"title": "Villaassistenten", "welcome": "Hur kan jag hjälpa dig?", "try": "Prova villaassistenten", "launch": "Fråga om villan", "close": "Stäng assistenten"}, "nb": {"title": "Villaassistenten", "welcome": "Hvordan kan jeg hjelpe?", "try": "Prøv villaassistenten", "launch": "Spør om villaen", "close": "Lukk assistenten"}, "da": {"title": "Villaassistenten", "welcome": "Hvordan kan jeg hjælpe?", "try": "Prøv villaassistenten", "launch": "Spørg om villaen", "close": "Luk assistenten"}, "de": {"title": "Villa-Assistent", "welcome": "Wie kann ich helfen?", "try": "Villa-Assistent ausprobieren", "launch": "Fragen zur Villa", "close": "Assistent schließen"}, "fr": {"title": "Assistant de la villa", "welcome": "Comment puis-je vous aider ?", "try": "Essayer l’assistant de la villa", "launch": "Questions sur la villa", "close": "Fermer l’assistant"}, "es": {"title": "Asistente de la villa", "welcome": "¿Cómo puedo ayudarte?", "try": "Probar el asistente de la villa", "launch": "Pregunta por la villa", "close": "Cerrar el asistente"}, "nl": {"title": "Villa-assistent", "welcome": "Hoe kan ik helpen?", "try": "Probeer de villa-assistent", "launch": "Vraag over de villa", "close": "Assistent sluiten"}, "et": {"title": "Villa assistent", "welcome": "Kuidas saan aidata?", "try": "Proovi villa assistenti", "launch": "Küsi villa kohta", "close": "Sulge assistent"}, "it": {"title": "Assistente della villa", "welcome": "Come posso aiutarti?", "try": "Prova l’assistente della villa", "launch": "Chiedi della villa", "close": "Chiudi l’assistente"}, "zh-CN": {"title": "别墅助手", "welcome": "有什么可以帮您？", "try": "试用别墅助手", "launch": "咨询别墅", "close": "关闭助手"}};
(()=>{
 const lang=({'no':'nb','zh-cn':'zh-CN'}[document.documentElement.lang]||document.documentElement.lang);
 const words=VILLA_WORDS[lang]||VILLA_WORDS.en;
 const url='https://tlvs-villa-private-pilot.onrender.com/guest/';
 const contextKey='tlvs-assistant-session-context-v1';

 function clean(value,max=200){
  return typeof value==='string'&&value.trim()?value.trim().slice(0,max):'';
 }
 function firstPageContext(){
  let referrer='';
  try{
   const parsed=document.referrer?new URL(document.referrer):null;
   if(parsed&&parsed.hostname&&parsed.hostname!==location.hostname)referrer=parsed.hostname;
  }catch(e){}
  const query=new URLSearchParams(location.search);
  return {
   landing:location.pathname,
   referrer,
   utm_source:clean(query.get('utm_source')),
   utm_medium:clean(query.get('utm_medium')),
   utm_campaign:clean(query.get('utm_campaign'))
  };
 }
 function loadSessionContext(){
  try{
   const existing=JSON.parse(sessionStorage.getItem(contextKey)||'null');
   if(existing&&typeof existing==='object'&&typeof existing.landing==='string')return existing;
   const created=firstPageContext();
   sessionStorage.setItem(contextKey,JSON.stringify(created));
   return created;
  }catch(e){
   return firstPageContext();
  }
 }
 const sessionContext=loadSessionContext();

 function track(name){
  if(!window.tlvsConsent?.analyticsAllowed?.()||typeof window.gtag!=='function')return;
  window.gtag('event',name,{assistant_language:lang,assistant_page:location.pathname});
 }
 window.addEventListener('message',event=>{
  if(event.origin!=='https://tlvs-villa-private-pilot.onrender.com'||!event.data||typeof event.data!=='object')return;
  if(event.data.type==='tlvs-assistant-question')track('assistant_question');
  if(event.data.type==='tlvs-assistant-error')track('assistant_error');
 });

 function frame(){
  const f=document.createElement('iframe');
  const params=new URLSearchParams({lang:Object.hasOwn(VILLA_WORDS,lang)?lang:'en',page:location.pathname,landing:sessionContext.landing||location.pathname});
  if(sessionContext.referrer)params.set('referrer',sessionContext.referrer);
  if(sessionContext.utm_source)params.set('utm_source',sessionContext.utm_source);
  if(sessionContext.utm_medium)params.set('utm_medium',sessionContext.utm_medium);
  if(sessionContext.utm_campaign)params.set('utm_campaign',sessionContext.utm_campaign);
  f.src=url+'#'+params.toString();
  f.title=words.title;
  f.allow='microphone';
  f.referrerPolicy='strict-origin-when-cross-origin';
  return f;
 }

 const target=document.querySelector('#villa-assistentti');
 if(target){
  const h=document.createElement('h2');h.textContent=words.welcome;h.className='doc-heading';target.append(h,frame());
  const hero=document.querySelector('.doc-hero .doc-copy');
  if(hero){const a=document.createElement('a');a.href='#villa-assistentti';a.className='villa-try';a.textContent=words.try+' ↓';hero.append(a);}
  return;
 }
 const button=document.createElement('button');
 button.className='villa-launch';button.textContent=words.launch;button.setAttribute('aria-expanded','false');document.body.append(button);
 const panel=document.createElement('section');
 panel.className='villa-panel';panel.hidden=true;panel.setAttribute('aria-label',words.title);
 const close=document.createElement('button');
 close.className='villa-close';close.textContent='×';close.setAttribute('aria-label',words.close);panel.append(close);document.body.append(panel);
 button.onclick=()=>{if(!panel.querySelector('iframe'))panel.append(frame());panel.hidden=false;button.hidden=true;button.setAttribute('aria-expanded','true');track('assistant_open');close.focus();};
 close.onclick=()=>{panel.hidden=true;button.hidden=false;button.setAttribute('aria-expanded','false');button.focus();};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close.click();});
})();
