import { lazy, type ComponentType } from 'react';
import { LegacyPage } from './LegacyPage';

export const routeNames = [
  'index.html',
  'index-en.html',
  'historia.html',
  'historia-en.html',
  'personagens.html',
  'personagens-en.html',
  'mundo.html',
  'mundo-en.html',
  'livro.html',
  'livro-en.html',
  'arquivos.html',
  'arquivos-en.html',
  'amostra.html',
  'amostra-en.html',
  '404.html'
] as const;

export type RouteName = (typeof routeNames)[number];

const routeSet = new Set<string>(routeNames);

const load = (loader: () => Promise<{ default: string }>): React.LazyExoticComponent<ComponentType> =>
  lazy(async () => {
    const module = await loader();
    return { default: () => <LegacyPage source={module.default} /> };
  });

const routeLoaders: Record<RouteName, () => Promise<{ default: string }>> = {
  'index.html': () => import('../content/pages/index.html?raw'),
  'index-en.html': () => import('../content/pages/index-en.html?raw'),
  'historia.html': () => import('../content/pages/historia.html?raw'),
  'historia-en.html': () => import('../content/pages/historia-en.html?raw'),
  'personagens.html': () => import('../content/pages/personagens.html?raw'),
  'personagens-en.html': () => import('../content/pages/personagens-en.html?raw'),
  'mundo.html': () => import('../content/pages/mundo.html?raw'),
  'mundo-en.html': () => import('../content/pages/mundo-en.html?raw'),
  'livro.html': () => import('../content/pages/livro.html?raw'),
  'livro-en.html': () => import('../content/pages/livro-en.html?raw'),
  'arquivos.html': () => import('../content/pages/arquivos.html?raw'),
  'arquivos-en.html': () => import('../content/pages/arquivos-en.html?raw'),
  'amostra.html': () => import('../content/pages/amostra.html?raw'),
  'amostra-en.html': () => import('../content/pages/amostra-en.html?raw'),
  '404.html': () => import('../content/pages/404.html?raw')
};

export const routeComponents = Object.fromEntries(
  routeNames.map((route) => [route, load(routeLoaders[route])])
) as Record<RouteName, React.LazyExoticComponent<ComponentType>>;

export function preloadRoute(route: RouteName): void {
  void routeLoaders[route]();
}

export function routeFromLocation(pathname = window.location.pathname): RouteName {
  const candidate = decodeURIComponent(pathname.split('/').filter(Boolean).at(-1) ?? 'index.html');
  return routeSet.has(candidate) ? (candidate as RouteName) : '404.html';
}

export function routeForBrowserLanguage(route: RouteName): RouteName {
  if (route === '404.html') return route;
  const wantsPortuguese = /^pt(?:-|$)/i.test(String(navigator.languages?.[0] ?? navigator.language ?? 'pt-BR'));
  const isEnglish = route.endsWith('-en.html');
  if (wantsPortuguese && isEnglish) return route.replace('-en.html', '.html') as RouteName;
  if (!wantsPortuguese && !isEnglish) return route.replace('.html', '-en.html') as RouteName;
  return route;
}

export function routeFromAnchor(anchor: HTMLAnchorElement): RouteName | null {
  const url = new URL(anchor.href, document.baseURI);
  if (url.origin !== window.location.origin) return null;
  const candidate = decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) ?? 'index.html');
  return routeSet.has(candidate) && candidate !== '404.html' ? (candidate as RouteName) : null;
}
