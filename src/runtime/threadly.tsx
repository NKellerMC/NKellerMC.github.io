import { createRoot, type Root } from 'react-dom/client';
import { ThreadlyFeed } from '../app/ThreadlyFeed';

let root: Root | undefined;

export function mountThreadly(): () => void {
  root?.unmount();
  root = undefined;
  const shell = document.querySelector<HTMLElement>('.threadly-shell');
  if (!shell) return () => undefined;
  const mount = document.createElement('div');
  mount.className = 'threadly-react-root';
  shell.replaceChildren(mount);
  root = createRoot(mount);
  root.render(<ThreadlyFeed english={/^en(?:-|$)/i.test(document.documentElement.lang)} />);
  return () => {
    root?.unmount();
    root = undefined;
  };
}

window.THERAN ??= {};
window.THERAN.mountThreadly = mountThreadly;
window.THERAN.cleanups ??= {};
window.THERAN.cleanups.threadly = mountThreadly();
