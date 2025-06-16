import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { readFileSync, readdirSync } from 'node:fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  server.get('/api/translations/global/:lang', (req, res) => {
    console.log('global');
    const lang = req.params.lang;
    const directoryPath = join(__dirname, 'assets/i18n/global/', lang);
    try {
      const files = readdirSync(directoryPath);
      const translations = files.reduce((acc, file) => {
        const content = JSON.parse(readFileSync(join(directoryPath, file), 'utf8'));
        return { ...acc, ...content };
      }, {});

      res.json(translations);
    } catch (error) {
      res.status(500).send('Error loading translations');
    }
  });

  server.get('/api/translations/module/:module', (req, res) => {
    const module = req.params.module;
    const directoryPath = join(__dirname, 'assets/i18n/module/', module);

    try {
      const files = readdirSync(directoryPath);
      const translations = files.reduce((acc, file) => {
        const content = JSON.parse(readFileSync(join(directoryPath, file), 'utf8'));
        return { ...acc, ...content };
      }, {});

      res.json(translations);
    } catch (error) {
      res.status(500).send('Error loading translations');
    }
  });

  return server;
}

function run(): void {
  console.log('Starting server...');
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
