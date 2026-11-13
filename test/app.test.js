const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { createApp } = require('../src/app');

let server;
let baseUrl;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('reports a healthy local server without exposing Express', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', records: 'fictional' });
  assert.equal(response.headers.get('x-powered-by'), null);
  assert.match(response.headers.get('content-security-policy'), /default-src 'self'/);
});

test('chooses Portuguese from the browser language', async () => {
  const response = await fetch(`${baseUrl}/`, {
    headers: { 'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8' }
  });
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /<html lang="pt-BR">/);
  assert.match(body, /Exames de funcionários/);
});

test('uses English when Portuguese is not requested', async () => {
  const response = await fetch(`${baseUrl}/`, {
    headers: { 'Accept-Language': 'en-US,en;q=0.9' }
  });
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(body, /<html lang="en">/);
  assert.match(body, /Employee examinations/);
});

test('keeps explicit English and Portuguese preview routes', async () => {
  const [english, portuguese] = await Promise.all([
    fetch(`${baseUrl}/marketing-preview/en`),
    fetch(`${baseUrl}/marketing-preview`)
  ]);
  const englishBody = await english.text();
  const portugueseBody = await portuguese.text();

  assert.match(englishBody, /Vacations and accounting/);
  assert.match(portugueseBody, /Férias e contabilidade/);
});

test('contains the five real frontend sections and fictional records', async () => {
  const response = await fetch(`${baseUrl}/en`);
  const body = await response.text();
  const tabs = body.match(/data-preview-target=/g) || [];

  assert.equal(tabs.length, 5);
  assert.match(body, /Olivia Carter/);
  assert.match(body, /Aurora Gardens Unit/);
  assert.match(body, /synthetic records/i);
});

test('serves the original preview interaction script', async () => {
  const response = await fetch(`${baseUrl}/marketing-preview.js`);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /javascript/);
  assert.match(body, /activatePreview/);
  assert.match(body, /history\.replaceState/);
});

test('does not expose private application endpoints', async () => {
  const response = await fetch(`${baseUrl}/api/sections`);
  assert.equal(response.status, 404);
});
