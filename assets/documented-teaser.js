/* TLVS Home — The Villa, Documented teaser. Keeps the existing Home HTML untouched while the new crawlable page is introduced. */
(function(){
  'use strict';
  const p=location.pathname.replace(/\/index\.html$/,'/');
  const homes=new Set(['/','/fi/','/sv/','/no/','/da/','/de/','/fr/','/es/','/nl/','/et/','/it/','/zh-cn/']);
  if(!homes.has(p) || document.querySelector('.tlvs-documented-teaser')) return;
  const spa=document.querySelector('.section-spa');
  if(!spa || !spa.parentNode) return;
  if(!document.querySelector('link[href="/assets/documented.css"]')){
    const link=document.createElement('link'); link.rel='stylesheet'; link.href='/assets/documented.css'; document.head.appendChild(link);
  }
  const lang=(document.documentElement.lang||'en').toLowerCase();
  const copy={
    en:{ey:'THE VILLA, DOCUMENTED',h:'Ask the property.',p:'The villa’s systems, history and operating knowledge have been structured into one intelligent property record — ready to answer questions when they matter.',c:'EXPLORE THE VILLA, DOCUMENTED →',folder:''},
    fi:{ey:'HUVILA, DOKUMENTOITUNA',h:'Kysy huvilalta.',p:'Huvilan järjestelmät, historia ja käyttötieto on koottu yhdeksi älykkääksi kiinteistötiedoksi — valmiiksi vastaamaan silloin, kun tietoa tarvitaan.',c:'TUTUSTU DOKUMENTOITUUN HUVILAAN →',folder:'fi'},
    sv:{ey:'VILLAN, DOKUMENTERAD',h:'Fråga villan.',p:'Villans system, historia och driftskunskap har strukturerats i ett intelligent fastighetsregister — redo att ge svar när de behövs.',c:'UTFORSKA DEN DOKUMENTERADE VILLAN →',folder:'sv'},
    nb:{ey:'VILLAEN, DOKUMENTERT',h:'Spør villaen.',p:'Villaens systemer, historie og driftskunnskap er strukturert i ett intelligent eiendomsregister — klart til å gi svar når det trengs.',c:'UTFORSK DEN DOKUMENTERTE VILLAEN →',folder:'no'},
    da:{ey:'VILLAEN, DOKUMENTERET',h:'Spørg villaen.',p:'Villaens systemer, historie og driftsviden er samlet i én intelligent ejendomsregistrering — klar til at give svar, når der er brug for dem.',c:'UDFORSK DEN DOKUMENTEREDE VILLA →',folder:'da'},
    de:{ey:'DIE VILLA, DOKUMENTIERT',h:'Fragen Sie die Villa.',p:'Systeme, Historie und Betriebswissen der Villa sind in einem intelligenten Objektwissen strukturiert — bereit für Antworten, wenn sie gebraucht werden.',c:'DIE DOKUMENTIERTE VILLA ENTDECKEN →',folder:'de'},
    fr:{ey:'LA VILLA, DOCUMENTÉE',h:'Interrogez la villa.',p:'Les systèmes, l’histoire et le savoir d’exploitation de la villa sont structurés dans un dossier immobilier intelligent — prêt à répondre lorsque cela compte.',c:'DÉCOUVRIR LA VILLA DOCUMENTÉE →',folder:'fr'},
    es:{ey:'LA VILLA, DOCUMENTADA',h:'Pregunta a la villa.',p:'Los sistemas, la historia y el conocimiento operativo de la villa se han estructurado en un único registro inteligente de la propiedad, listo para responder cuando importa.',c:'DESCUBRIR LA VILLA DOCUMENTADA →',folder:'es'},
    nl:{ey:'DE VILLA, GEDOCUMENTEERD',h:'Vraag het de villa.',p:'De systemen, geschiedenis en operationele kennis van de villa zijn samengebracht in één intelligent vastgoeddossier — klaar om antwoord te geven wanneer dat nodig is.',c:'ONTDEK DE GEDOCUMENTEERDE VILLA →',folder:'nl'},
    et:{ey:'VILLA, DOKUMENTEERITUD',h:'Küsi villalt.',p:'Villa süsteemid, ajalugu ja kasutusteadmised on koondatud üheks intelligentseks kinnisvarateadmiste kogumiks — valmis vastama siis, kui seda vaja on.',c:'AVASTA DOKUMENTEERITUD VILLA →',folder:'et'},
    it:{ey:'LA VILLA, DOCUMENTATA',h:'Chiedi alla villa.',p:'Sistemi, storia e conoscenze operative della villa sono strutturati in un unico patrimonio informativo intelligente — pronto a rispondere quando serve.',c:'SCOPRI LA VILLA DOCUMENTATA →',folder:'it'},
    'zh-cn':{ey:'别墅档案',h:'向别墅提问。',p:'别墅的系统、历史与运营知识已被整理为一套智能房产知识记录，在真正需要时提供清晰答案。',c:'探索别墅档案 →',folder:'zh-cn'}
  };
  const t=copy[lang]||copy.en;
  const href=t.folder?('/'+t.folder+'/the-villa-documented.html'):'/the-villa-documented.html';
  const section=document.createElement('section');
  section.className='tlvs-documented-teaser';
  section.id='documented';
  section.setAttribute('aria-labelledby','documented-teaser-title');
  section.innerHTML='<div class="doc-teaser-copy"><div class="eyebrow">'+t.ey+'</div><h2 id="documented-teaser-title">'+t.h+'</h2><p>'+t.p+'</p><a class="cta" href="'+href+'">'+t.c+'</a></div><div class="doc-teaser-media" role="img" aria-label="'+(lang==='fi'?'Huvilan dokumentoitua teknistä tietoa kuvaava näkymä':'Documented property knowledge at Lakeside Villa & Spa')+'"></div>';
  spa.insertAdjacentElement('afterend',section);
}());
