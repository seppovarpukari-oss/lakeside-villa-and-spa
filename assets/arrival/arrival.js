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
  let loading = null;
  let ratio = 0;
  let userPaused = false;
  let complete = false;
  let requestingPlay = false;
  let usingV3 = false;
  let v3Url = null;
  const legacySource = () => window.matchMedia('(max-width: 800px)').matches || saveData
    ? video.dataset.mobile : video.dataset.desktop;
  const updateControl = () => {
    const action = complete ? 'replay' : video.paused ? 'play' : 'pause';
    label.textContent = button.dataset[action];
    button.dataset.action = action;
    button.setAttribute('aria-label', button.dataset[action]);
  };
  // New v3 is byte-for-byte identical to the approved Full HD file. Chunks are
  // required only by the transfer path; the browser joins them without transcoding.
  // All v13 assets remain untouched and are used automatically if v3 cannot load.
  const load = () => {
    if (loading) return loading;
    loading = (async () => {
      const mobile = window.matchMedia('(max-width: 800px)').matches || saveData;
      const filename = mobile ? 'arrival-v3-720p.mp4' : 'arrival-v3-1080p.mp4';
      const numberOfParts = mobile ? 6 : 18;
      const expectedBytes = mobile ? 4647090 : 13953667;
      const parts = new Array(numberOfParts);
      let nextPart = 0;
      try {
        const workers = Array.from({ length: Math.min(6, numberOfParts) }, async () => {
          while (true) {
            const i = nextPart++;
            if (i >= numberOfParts) return;
            const url = '/assets/arrival/v3-chunks/' + filename + '.part' + String(i).padStart(3, '0');
            const response = await fetch(url);
            if (!response.ok) throw new Error('Could not load v3 segment ' + i);
            parts[i] = await response.arrayBuffer();
          }
        });
        await Promise.all(workers);
        if (parts.reduce((total, part) => total + (part ? part.byteLength : 0), 0) !== expectedBytes) {
          throw new Error('Incomplete v3 video');
        }
        v3Url = URL.createObjectURL(new Blob(parts, { type: 'video/mp4' }));
        video.src = v3Url;
        usingV3 = true;
        video.poster = '/assets/arrival/media/arrival-v3-poster.jpg';
        endImage.src = '/assets/arrival/media/arrival-v3-end.jpg';
      } catch (_) {
        // Preserve the prior production video as a working recovery path.
        video.src = legacySource();
        usingV3 = false;
        video.poster = '/assets/arrival/media/arrival-dusk-v13-poster.jpg';
        endImage.src = '/assets/arrival/media/arrival-dusk-v13-end.jpg';
      }
      video.load();
      loaded = true;
    })();
    return loading;
  };
  const play = async (manual = false) => {
    if (requestingPlay) return;
    if (!manual && (complete || userPaused || reduced.matches || saveData || document.hidden || ratio < 0.6)) return;
    requestingPlay = true;
    try {
      await load();
      await video.play();
      if (document.hidden || (!manual && (ratio < 0.1 || reduced.matches || userPaused))) video.pause();
    } catch (_) {
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
  // Show the new video's poster from the outset, including before lazy loading.
  video.poster = '/assets/arrival/media/arrival-v3-poster.jpg';
  ['play', 'pause'].forEach(event => video.addEventListener(event, updateControl));
  video.addEventListener('ended', () => {
    complete = true;
    // Preserve V3's decoded final video frame instead of switching to a
    // separately exported JPEG, which can cause a visible camera-angle snap.
    // Keep the previous V13 fallback's end-image behavior unchanged.
    endImage.hidden = usingV3;
    updateControl();
  });
  video.addEventListener('error', () => {
    if (usingV3) {
      usingV3 = false;
      if (v3Url) URL.revokeObjectURL(v3Url);
      v3Url = null;
      video.poster = '/assets/arrival/media/arrival-dusk-v13-poster.jpg';
      endImage.src = '/assets/arrival/media/arrival-dusk-v13-end.jpg';
      video.src = legacySource();
      video.load();
      return;
    }
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