import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const root = process.cwd();
const output = resolve(root, 'dist');
const routeFiles = [
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

const staticDirectories = ['assets', 'bibi-v716', 'bibi-bookshelf', 'licenses'] as const;
const staticFiles = ['robots.txt', 'site.webmanifest'] as const;

function extractRouteMetadata(legacyHtml: string): string {
  const head = legacyHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const selected: string[] = [];
  const title = head.match(/<title>[\s\S]*?<\/title>/i)?.[0];
  if (title) selected.push(title);
  for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
    if (/name=["'](?:description|author|robots|theme-color)["']/i.test(tag) || /property=["']og:/i.test(tag)) selected.push(tag);
  }
  for (const tag of head.match(/<link\b[^>]*>/gi) ?? []) {
    if (/rel=["']alternate["']/i.test(tag)) selected.push(tag);
  }
  for (const tag of head.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? []) selected.push(tag);
  return selected.join('');
}

function withRouteMetadata(shell: string, legacyHtml: string): string {
  const metadata = extractRouteMetadata(legacyHtml);
  return shell
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*>/i, '')
    .replace('</head>', `${metadata}</head>`);
}

function preserveStaticSite(): Plugin {
  return {
    name: 'theran-static-assets-and-routes',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://theran.local').pathname);
        const route = pathname.split('/').filter(Boolean).at(-1);
        if (route && route !== 'index.html' && routeFiles.includes(route as (typeof routeFiles)[number])) request.url = '/index.html';
        next();
      });
    },
    closeBundle() {
      mkdirSync(output, { recursive: true });
      for (const directory of staticDirectories) {
        cpSync(resolve(root, directory), resolve(output, directory), { recursive: true, force: true });
      }
      for (const file of staticFiles) cpSync(resolve(root, file), resolve(output, file), { force: true });

      const shell = readFileSync(resolve(output, 'index.html'), 'utf8');
      for (const route of routeFiles) {
        const legacy = readFileSync(resolve(root, 'src/content/pages', route), 'utf8');
        writeFileSync(resolve(output, basename(route)), withRouteMetadata(shell, legacy));
      }
      writeFileSync(resolve(output, '.nojekyll'), '');
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), preserveStaticSite()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2022'
  }
});
