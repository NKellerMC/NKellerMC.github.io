(() => {
  'use strict';

  const THERAN = window.THERAN = window.THERAN || {};
  const ROUTES = new Set([
    'index.html', 'index-en.html',
    'historia.html', 'historia-en.html',
    'personagens.html', 'personagens-en.html',
    'mundo.html', 'mundo-en.html',
    'livro.html', 'livro-en.html',
    'arquivos.html', 'arquivos-en.html',
    'amostra.html', 'amostra-en.html'
  ]);
  const cache = new Map();
  const loadedScripts = new Set(
    [...document.scripts].filter((script) => script.src).map((script) => script.src)
  );
  let navigationController = null;
  let navigationId = 0;

  document.head.querySelectorAll('style').forEach((style) => {
    style.dataset.theranPageStyle = '';
  });
  document.head.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    link.dataset.theranPageStylesheet = '';
  });

  const routeName = (url) => {
    const name = url.pathname.split('/').pop();
    return name || 'index.html';
  };

  const isSpaRoute = (url) => {
    return /^(https?:)$/.test(url.protocol)
      && url.origin === location.origin
      && ROUTES.has(routeName(url));
  };

  const cleanupPage = () => {
    Object.values(THERAN.cleanups || {}).forEach((cleanup) => {
      try { cleanup?.(); } catch (_) {}
    });
    THERAN.cleanups = {};
  };

  const fetchPage = async (url, signal) => {
    const key = new URL(url.href);
    key.hash = '';
    const cacheKey = key.href;
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const response = await fetch(cacheKey, {
      signal,
      headers: { Accept: 'text/html', 'X-Theran-Navigation': 'spa' }
    });
    if (!response.ok) throw new Error(`Route ${response.status}`);
    const html = await response.text();
    cache.set(cacheKey, html);
    return html;
  };

  const replaceHeadCollection = (currentSelector, targetNodes) => {
    document.head.querySelectorAll(currentSelector).forEach((node) => node.remove());
    targetNodes.forEach((node) => document.head.append(document.importNode(node, true)));
  };

  const applyHead = async (nextDocument) => {
    const nextStylesheets = [...nextDocument.head.querySelectorAll('link[rel="stylesheet"]')].map((link) => {
      const clone = document.importNode(link, true);
      clone.dataset.theranPageStylesheet = '';
      return clone;
    });
    const oldStylesheets = [...document.head.querySelectorAll('link[data-theran-page-stylesheet]')];
    await Promise.all(nextStylesheets.map((link) => new Promise((resolve) => {
      const originalMedia = link.media;
      link.media = 'not all';
      const finish = () => {
        window.clearTimeout(timer);
        link.media = originalMedia;
        resolve();
      };
      const timer = window.setTimeout(finish, 2000);
      link.addEventListener('load', finish, { once: true });
      link.addEventListener('error', finish, { once: true });
      document.head.append(link);
    })));

    const nextStyles = [...nextDocument.head.querySelectorAll('style')].map((style) => {
      const clone = document.importNode(style, true);
      clone.dataset.theranPageStyle = '';
      return clone;
    });
    const oldStyles = [...document.head.querySelectorAll('style[data-theran-page-style]')];
    nextStyles.forEach((style) => document.head.append(style));
    oldStyles.forEach((style) => style.remove());
    oldStylesheets.forEach((link) => link.remove());

    replaceHeadCollection(
      'meta[name="description"],meta[name="author"],meta[name="robots"],meta[name="theme-color"],meta[property^="og:"]',
      [...nextDocument.head.querySelectorAll('meta[name="description"],meta[name="author"],meta[name="robots"],meta[name="theme-color"],meta[property^="og:"]')]
    );
    replaceHeadCollection(
      'link[rel="alternate"]',
      [...nextDocument.head.querySelectorAll('link[rel="alternate"]')]
    );
    replaceHeadCollection(
      'link[rel="preload"]',
      [...nextDocument.head.querySelectorAll('link[rel="preload"]')]
    );
    replaceHeadCollection(
      'script[type="application/ld+json"]',
      [...nextDocument.head.querySelectorAll('script[type="application/ld+json"]')]
    );

    document.title = nextDocument.title;
    document.documentElement.lang = nextDocument.documentElement.lang;
  };

  const applyBody = (nextDocument) => {
    [...document.body.attributes].forEach((attribute) => {
      document.body.removeAttribute(attribute.name);
    });
    [...nextDocument.body.attributes].forEach((attribute) => {
      document.body.setAttribute(attribute.name, attribute.value);
    });

    const content = document.createDocumentFragment();
    [...nextDocument.body.childNodes].forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') return;
      content.append(document.importNode(node, true));
    });
    document.body.replaceChildren(content);
  };

  const ensureScript = (path) => {
    const src = new URL(path, document.baseURI).href;
    if (loadedScripts.has(src)) return Promise.resolve(false);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.dataset.theranSpaModule = '';
      script.addEventListener('load', () => {
        loadedScripts.add(src);
        resolve(true);
      }, { once: true });
      script.addEventListener('error', () => reject(new Error(`Module ${path}`)), { once: true });
      document.head.append(script);
    });
  };

  const mountModule = async (path, mountName) => {
    const loadedNow = await ensureScript(path);
    if (!loadedNow) THERAN[mountName]?.();
  };

  const mountPage = async (url) => {
    await mountModule('assets/js/site.v71.js', 'mountSite');
    const name = routeName(url);

    if (name === 'index.html' || name === 'index-en.html') {
      await mountModule('assets/js/ocean.official.js', 'mountOcean');
      return;
    }
    if (name === 'arquivos.html' || name === 'arquivos-en.html') {
      await mountModule('assets/js/archive.official.js', 'mountArchive');
      await mountModule('assets/js/james-phone.js', 'mountJamesPhone');
      return;
    }
    if (name === 'livro.html' || name === 'livro-en.html' || name === 'amostra.html' || name === 'amostra-en.html') {
      await ensureScript('assets/js/config.js');
      await mountModule('assets/js/stores.js', 'mountStores');
    }
    if (name === 'amostra.html' || name === 'amostra-en.html') {
      await mountModule('assets/js/sample-reader.js', 'mountSampleReader');
    }
  };

  const navigate = async (url, { push = true } = {}) => {
    const id = ++navigationId;
    navigationController?.abort();
    navigationController = new AbortController();

    try {
      const html = await fetchPage(url, navigationController.signal);
      if (id !== navigationId) return;
      const nextDocument = new DOMParser().parseFromString(html, 'text/html');
      if (!nextDocument.body || !nextDocument.title) throw new Error('Invalid route document');

      cleanupPage();
      await applyHead(nextDocument);
      if (id !== navigationId) return;
      applyBody(nextDocument);
      if (push) history.pushState({ theranSpa: true }, '', url.href);
      try { sessionStorage.removeItem('theran-link-navigation'); } catch (_) {}
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      await mountPage(url);
    } catch (error) {
      if (error.name === 'AbortError') return;
      if (push) location.assign(url.href);
      else location.reload();
    }
  };

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download')) return;
    if (link.target && link.target !== '_self') return;
    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#')) return;
    const url = new URL(link.href, document.baseURI);
    if (!isSpaRoute(url)) return;
    event.preventDefault();
    navigate(url);
  });

  addEventListener('popstate', () => {
    const url = new URL(location.href);
    if (isSpaRoute(url)) navigate(url, { push: false });
  });

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  THERAN.spa = { navigate };
})();
