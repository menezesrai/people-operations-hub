const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const publicDirectory = path.join(__dirname, '..', 'public');

function prefersPortuguese(request) {
  const accepted = request.acceptsLanguages();
  return accepted.some((language) => /^pt(?:-|$)/i.test(language));
}

function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"]
        }
      }
    })
  );
  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 180,
      standardHeaders: 'draft-8',
      legacyHeaders: false
    })
  );

  const sendPreview = (filename) => (_request, response) => {
    response.sendFile(path.join(publicDirectory, filename));
  };

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', records: 'fictional' });
  });

  app.get('/', (request, response) => {
    const filename = prefersPortuguese(request) ? 'pt-br.html' : 'en.html';
    response.sendFile(path.join(publicDirectory, filename));
  });
  app.get(['/en', '/en/', '/marketing-preview/en', '/marketing-preview/en/'], sendPreview('en.html'));
  app.get(['/pt-br', '/pt-br/', '/marketing-preview', '/marketing-preview/'], sendPreview('pt-br.html'));

  app.use(express.static(publicDirectory, { index: false }));
  app.use((_request, response) => {
    response.status(404).json({ error: 'Not found.' });
  });

  return app;
}

module.exports = { createApp, prefersPortuguese };
