import archiveUrl from '../../assets/js/archive.official.js?url';

let pending: Promise<void> | undefined;

export function loadArchiveRuntime(): Promise<void> {
  if (window.THERAN?.mountArchive) return Promise.resolve();
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = archiveUrl;
    script.async = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('Falha ao carregar o arquivo do Orin.')), { once: true });
    document.head.append(script);
  });
  return pending;
}
