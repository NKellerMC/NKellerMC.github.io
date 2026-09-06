import { startTransition, Suspense, useEffect, useMemo, useState } from 'react';
import { preloadRoute, routeComponents, routeForBrowserLanguage, routeFromAnchor, routeFromLocation, type RouteName } from './routes';

function initialRoute(): RouteName {
  const route = routeFromLocation();
  const localized = routeForBrowserLanguage(route);
  if (localized !== route) history.replaceState({ theranRoute: localized }, '', `./${localized}${location.hash}`);
  return localized;
}

export function App() {
  const [route, setRoute] = useState<RouteName>(initialRoute);
  const Page = useMemo(() => routeComponents[route], [route]);

  useEffect(() => {
    const navigate = (next: RouteName, href: string, replace = false) => {
      const method = replace ? 'replaceState' : 'pushState';
      if (next === route) {
        history[method]({ theranRoute: next }, '', href);
        const targetId = decodeURIComponent(new URL(href, document.baseURI).hash.slice(1));
        if (targetId) document.getElementById(targetId)?.scrollIntoView();
        return;
      }
      history[method]({ theranRoute: next }, '', href);
      startTransition(() => setRoute(next));
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const raw = anchor.getAttribute('href') ?? '';
      if (!raw || raw.startsWith('#')) return;
      const next = routeFromAnchor(anchor);
      if (!next) return;
      event.preventDefault();
      const url = new URL(anchor.href, document.baseURI);
      navigate(next, `${url.pathname}${url.search}${url.hash}`);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor) return;
      const next = routeFromAnchor(anchor);
      if (next) preloadRoute(next);
    };

    const onPopState = () => startTransition(() => setRoute(routeForBrowserLanguage(routeFromLocation())));
    document.addEventListener('click', onClick);
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('popstate', onPopState);
    };
  }, [route]);

  return (
    <Suspense fallback={<div className="route-loading" role="status" aria-label="Carregando" />}>
      <Page />
    </Suspense>
  );
}
