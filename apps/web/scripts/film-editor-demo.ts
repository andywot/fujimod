import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { staticFiles } from './local-review-files.ts';

/** Where the home page's live Film Editor is served. */
export const filmEditorDemoPath = 'demo/film-editor';

const file = /^[A-Za-z0-9_.-]+$/;

/** The demo's manifest.json: schema 1 and the flat file names the page loads. */
export function parseFilmEditorDemo(json: string): string[] {
  const manifest = JSON.parse(json) as { schema?: unknown; files?: unknown } | null;
  if (manifest?.schema !== 1 || !Array.isArray(manifest.files))
    throw Error('The Film Editor demo manifest has an unknown schema.');
  const files = manifest.files as unknown[];
  if (!files.includes('index.html'))
    throw Error('The Film Editor demo manifest has no index.html.');
  for (const name of files)
    if (typeof name !== 'string' || !file.test(name) || name.startsWith('.'))
      throw Error(`The Film Editor demo manifest names an invalid file: ${String(name)}`);
  return files as string[];
}

/** Serves FUJIMOD_FILM_EDITOR_DEMO in development and copies it into the build. */
export function siteFilmEditorDemo(configured: string | undefined): Plugin {
  let directory: string | undefined;
  let files: string[] = [];
  return {
    name: 'site-film-editor-demo',
    config() {
      if (configured) {
        const manifest = resolve(configured, 'manifest.json');
        if (!existsSync(manifest))
          throw Error(`FUJIMOD_FILM_EDITOR_DEMO has no manifest.json: ${configured}`);
        files = parseFilmEditorDemo(readFileSync(manifest, 'utf8'));
        directory = realpathSync(configured);
      }
      return { define: { __FUJIMOD_FILM_EDITOR_DEMO__: JSON.stringify(!!directory) } };
    },
    configureServer(server) {
      if (!directory) return;
      const source = directory;
      const allowed = new Set(files.map((name) => resolve(source, name)));
      server.middlewares.use(
        staticFiles(source, `/${filmEditorDemoPath}/`, (path) => allowed.has(path)),
      );
    },
    writeBundle(options) {
      if (this.environment.name !== 'client' || !directory || !options.dir) return;
      const destination = resolve(options.dir, filmEditorDemoPath);
      for (const name of files) {
        const target = resolve(destination, name);
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(resolve(directory, name), target);
      }
    },
  };
}
