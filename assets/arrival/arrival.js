(() => {
  'use strict';
  const section = document.querySelector('[data-arrival]');
  if (!section) return;
  const video = section.querySelector('video');
  const button = section.querySelector('button');
  const label = button.querySelector('span');
  const endImage = section.querySelector('.arrival-end');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let loaded = false;
  let ratio = 0;
  let userPaused = false;
  let complete = false;
  let requestingPlay = false;
  const updateControl = () => {
    const action = complete ? 'replay' : video.paused ? 'play' : 'pause';
    label.textContent = button.dataset[action];
    button.dataset.action = action;
    button.setAttribute('aria-label', button.dataset[action]);
  };
  const load = () => {
    if (loaded) return;
    video.src = window.matchMedia('(max-width: 800px)').matches || saveData
      ? video.dataset.mobile : video.dataset.desktop;
    video.load();
    loaded = true;
  };
  const play = async (manual = false) => {
    if (requestingPlay) return;
    if (!manual && (complete || userPaused || reduced.matches || saveData || document.hidden || ratio < 0.6)) return;
    load();
    requestingPlay = true;
    try {
      await video.play();
      if (document.hidden || (!manual && (ratio < 0.1 || reduced.matches || userPaused))) video.pause();
    } catch (_) {
      // Autoplay restrictions leave the poster and an explicit play control.
      userPaused = true;
    } finally {
      requestingPlay = false;
      updateControl();
    }
  };
  video.muted = true;
  video.loop = false;
  video.controls = false;
  button.hidden = false;
  ['play', 'pause'].forEach(event => video.addEventListener(event, updateControl));
  video.addEventListener('ended', () => {
    complete = true;
    endImage.hidden = false;
    updateControl();
  });
  video.addEventListener('error', () => {
    video.controls = true;
    userPaused = true;
    updateControl();
  });
  button.addEventListener('click', () => {
    if (!video.paused) {
      userPaused = true;
      video.pause();
      return;
    }
    if (complete) {
      video.currentTime = 0;
      complete = false;
      endImage.hidden = true;
    }
    userPaused = false;
    play(true);
  });
  if ('IntersectionObserver' in window) {
    const preload = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        if (!reduced.matches && !saveData) load();
        preload.disconnect();
      }
    }, { rootMargin: '600px 0px' });
    preload.observe(video);
    const visibility = new IntersectionObserver(entries => {
      ratio = entries[0].intersectionRatio;
      if (ratio < 0.1 && !video.paused) video.pause();
      else if (ratio >= 0.6) play();
    }, { threshold: [0, 0.1, 0.6, 1] });
    visibility.observe(video);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else play();
  });
  window.addEventListener('pagehide', () => video.pause());
  window.addEventListener('pageshow', () => play());
  reduced.addEventListener('change', () => {
    if (reduced.matches) video.pause();
    else play();
  });
  updateControl();
})();
