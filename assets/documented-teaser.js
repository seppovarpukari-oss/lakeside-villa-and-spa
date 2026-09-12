/* TLVS Documented mobile language picker. */
(function(){
  'use strict';
  if(!document.body || !document.body.classList.contains('documented-page')) return;
  const mobilePanel=document.querySelector('.mobile-nav-panel');
  const desktopPicker=document.querySelector('.desktop-nav .tlvs-language-picker');
  if(mobilePanel && desktopPicker && !mobilePanel.querySelector('.tlvs-language-picker')){
    const picker=desktopPicker.cloneNode(true);
    picker.classList.add('mobile-language-picker');
    mobilePanel.appendChild(picker);
  }
}());
