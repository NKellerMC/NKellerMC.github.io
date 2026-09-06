window.THERAN=window.THERAN||{};
window.THERAN.mountStores=() => {
  'use strict';

  const lang = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';
  const config = window.THERAN_CONFIG?.stores?.[lang] || {};
  const labels = lang === 'en'
    ? { buy: 'Buy', open: 'Open', pending: 'Coming soon' }
    : { buy: 'Comprar', open: 'Abrir', pending: 'Em breve' };

  const storeKey = (value) => {
    if (value === 'apple-books') return 'appleBooks';
    if (value === 'google-play-books') return 'googlePlayBooks';
    return value;
  };

  const safeStoreUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value.trim());
      return url.protocol === 'https:' ? url.href : '';
    } catch {
      return '';
    }
  };

  document.querySelectorAll('[data-store]').forEach((link) => {
    const url = safeStoreUrl(config[storeKey(link.dataset.store)]);
    const status = link.querySelector('[data-store-status]');
    const isBuy = link.dataset.storeCta === 'buy';

    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.classList.remove('is-pending');
      link.removeAttribute('aria-disabled');
      if (status) status.textContent = isBuy ? labels.buy : labels.open;
      return;
    }

    link.removeAttribute('href');
    link.removeAttribute('target');
    link.removeAttribute('rel');
    link.classList.add('is-pending');
    link.setAttribute('aria-disabled', 'true');
    if (status) status.textContent = labels.pending;
  });
};
window.THERAN.mountStores();
export {};
