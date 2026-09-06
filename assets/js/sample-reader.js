window.THERAN=window.THERAN||{};
window.THERAN.cleanups=window.THERAN.cleanups||{};
window.THERAN.mountSampleReader=() => {
  window.THERAN.cleanups.sampleReader?.();
  'use strict';

  const frame = document.querySelector('.bibi-shell iframe');
  const shell = frame?.closest('.bibi-shell');
  const panel = document.querySelector('[data-sample-purchase]');
  if (!frame || !panel) return;

  const closeButton = panel.querySelector('[data-sample-purchase-close]');
  const controller = new AbortController();
  const signal = controller.signal;
  let hideTimer = 0;

  const markReaderReady = () => {
    shell?.classList.remove('is-loading');
    shell?.classList.add('is-ready');
  };

  const showPurchase = () => {
    window.clearTimeout(hideTimer);
    panel.hidden = false;
    requestAnimationFrame(() => {
      panel.classList.add('is-visible');
      closeButton?.focus({ preventScroll: true });
    });
  };

  const hidePurchase = () => {
    panel.classList.remove('is-visible');
    hideTimer = window.setTimeout(() => { panel.hidden = true; }, 240);
  };

  window.addEventListener('message', (event) => {
    if (event.source !== frame.contentWindow) return;
    if (event.origin !== window.location.origin) return;
    if (event.data?.type === 'theran:reader-ready') markReaderReady();
    if (event.data?.type === 'theran:sample-end') showPurchase();
  }, { signal });

  // Redundant hook for same-origin installs. The Bibi extension above is the primary bridge.
  frame.addEventListener('load', () => {
    try {
      const readerWindow = frame.contentWindow;
      if (!readerWindow || !readerWindow.E || typeof readerWindow.E.bind !== 'function') return;
      markReaderReady();
      if (readerWindow.__THERAN_SAMPLE_END_BOUND__) return;
      readerWindow.__THERAN_SAMPLE_END_BOUND__ = true;
      readerWindow.E.bind('bibi:got-to-the-end', showPurchase);
    } catch (_) {}
  }, { signal });

  closeButton?.addEventListener('click', hidePurchase, { signal });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) hidePurchase();
  }, { signal });

  const cleanup = () => {
    window.clearTimeout(hideTimer);
    controller.abort();
  };
  window.THERAN.cleanups.sampleReader = cleanup;
  return cleanup;
};
window.THERAN.mountSampleReader();
export {};
