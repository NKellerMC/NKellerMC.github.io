import { useEffect, useLayoutEffect, useMemo } from 'react';

type Snapshot = {
  bodyAttributes: Array<[string, string]>;
  bodyHtml: string;
  headNodes: string[];
  lang: string;
  page: string;
  stylesheets: string[];
  styles: string;
  title: string;
};

const managedHeadSelector = '[data-theran-react-head]';

function parsePage(source: string): Snapshot {
  const documentSnapshot = new DOMParser().parseFromString(source, 'text/html');
  documentSnapshot.body.querySelectorAll('script').forEach((script) => script.remove());
  const lang = documentSnapshot.documentElement.lang || 'pt-BR';
  const footerAuthor = documentSnapshot.body.querySelector('.footer-bottom > span:first-child');
  if (footerAuthor) {
    const contact = documentSnapshot.createElement('a');
    contact.className = 'footer-contact';
    contact.href = 'mailto:bynoahkeller@gmail.com';
    contact.textContent = /^pt(?:-|$)/i.test(lang) ? 'Contato' : 'Contact';
    contact.setAttribute('aria-label', /^pt(?:-|$)/i.test(lang) ? 'Entrar em contato por e-mail' : 'Contact by email');
    footerAuthor.append(' · ', contact);
  }
  const styles = [...documentSnapshot.head.querySelectorAll('style')].map((style) => style.textContent ?? '').join('\n');
  const headNodes = [...documentSnapshot.head.querySelectorAll(
    'meta[name="description"],meta[name="author"],meta[name="robots"],meta[name="theme-color"],meta[property^="og:"],link[rel="alternate"],script[type="application/ld+json"]'
  )].map((node) => node.outerHTML);
  return {
    bodyAttributes: [...documentSnapshot.body.attributes].map((attribute) => [attribute.name, attribute.value]),
    bodyHtml: documentSnapshot.body.innerHTML,
    headNodes,
    lang,
    page: documentSnapshot.body.dataset.page ?? '',
    stylesheets: [...documentSnapshot.head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map((link) => link.getAttribute('href') ?? '').filter(Boolean),
    styles,
    title: documentSnapshot.title || 'THERAN'
  };
}

function cleanupRuntime(): void {
  Object.values(window.THERAN?.cleanups ?? {}).forEach((cleanup) => {
    try { cleanup?.(); } catch { /* A próxima montagem recria o módulo. */ }
  });
  if (window.THERAN) window.THERAN.cleanups = {};
}

const loadedRuntimeModules = new Set<string>();

async function loadRuntimeModule(key: string, loader: () => Promise<unknown>, mount: () => unknown): Promise<void> {
  const firstLoad = !loadedRuntimeModules.has(key);
  await loader();
  loadedRuntimeModules.add(key);
  if (!firstLoad) mount();
}

async function mountRuntime(): Promise<void> {
  const page = document.body.dataset.page;
  await loadRuntimeModule('site', () => import('../../assets/js/site.v71.js'), () => window.THERAN?.mountSite?.());
  if (page === 'home') {
    await loadRuntimeModule('ocean', () => import('../../assets/js/ocean.official.js'), () => window.THERAN?.mountOcean?.());
  }
  if (page === 'arquivos') {
    await loadRuntimeModule('archive', async () => {
      const { loadArchiveRuntime } = await import('../runtime/archive');
      await loadArchiveRuntime();
    }, () => window.THERAN?.mountArchive?.());
    await loadRuntimeModule('threadly', () => import('../runtime/threadly'), () => window.THERAN?.mountThreadly?.());
    await loadRuntimeModule('phone', () => import('../../assets/js/james-phone.js'), () => window.THERAN?.mountJamesPhone?.());
  }
  if (page === 'livro') {
    await import('../../assets/js/config.js');
    await loadRuntimeModule('stores', () => import('../../assets/js/stores.js'), () => window.THERAN?.mountStores?.());
  }
  if (document.querySelector('.bibi-shell')) {
    await loadRuntimeModule('reader', () => import('../../assets/js/sample-reader.js'), () => window.THERAN?.mountSampleReader?.());
  }
}

export function LegacyPage({ source }: { source: string }) {
  const snapshot = useMemo(() => parsePage(source), [source]);

  useLayoutEffect(() => {
    cleanupRuntime();
    document.title = snapshot.title;
    document.documentElement.lang = snapshot.lang;
    document.documentElement.classList.toggle('theran-phone-page', snapshot.page === 'arquivos');
    [...document.body.attributes].forEach((attribute) => document.body.removeAttribute(attribute.name));
    for (const [name, value] of snapshot.bodyAttributes) document.body.setAttribute(name, value);

    document.head.querySelectorAll(managedHeadSelector).forEach((node) => node.remove());
    if (snapshot.headNodes.length) {
      const template = document.createElement('template');
      template.innerHTML = snapshot.headNodes.join('');
      for (const node of [...template.content.childNodes]) {
        if (node instanceof HTMLElement) node.dataset.theranReactHead = '';
        document.head.append(node);
      }
    }
    for (const href of snapshot.stylesheets) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.theranReactHead = '';
      document.head.append(link);
    }
  }, [snapshot]);

  useEffect(() => {
    let active = true;
    const frame = requestAnimationFrame(() => {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (targetId) document.getElementById(targetId)?.scrollIntoView();
      else window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      void mountRuntime().then(() => {
        if (!active) cleanupRuntime();
      });
    });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      cleanupRuntime();
    };
  }, [snapshot]);

  return (
    <>
      <style data-theran-route-style dangerouslySetInnerHTML={{ __html: snapshot.styles }} />
      <div className="theran-route-root" dangerouslySetInnerHTML={{ __html: snapshot.bodyHtml }} />
    </>
  );
}
