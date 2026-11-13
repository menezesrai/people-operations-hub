# People Operations Dashboard

> All names, locations, request numbers and dates in this repository are fictional. No employee or company records were copied into the project.

This is the public version of a Node.js dashboard I built for recurring people-operations work. It reuses the real frontend from the private application, but runs with a separate set of fictional records made for demonstration.

The dashboard keeps five routines in the same interface:

- employee examinations;
- vacations and accounting handoffs;
- medical certificates;
- probation periods;
- short internal tools.

The sections can be opened from the sidebar in English or Brazilian Portuguese. The tables show the type of information the private application organizes without reproducing its records, authentication or integrations.

## Run locally

Node.js 20.18 or newer is required.

```bash
npm install
npm start
```

Open `http://localhost:3000`.

The root page follows the browser language. These routes are also available directly:

- `http://localhost:3000/en`
- `http://localhost:3000/pt-br`
- `http://localhost:3000/marketing-preview/en`
- `http://localhost:3000/marketing-preview`

## What was kept

- The real dashboard layout, navigation and visual treatment.
- The five original frontend sections.
- English and Brazilian Portuguese views.
- The same tab interaction used by the portfolio preview.
- Security headers and local rate limiting in the Express server.

## What was left out

- Employee records and uploaded documents.
- User accounts, sessions and passwords.
- Email delivery and scheduled reminders.
- PDF generation and private document templates.
- Company configuration and production environment files.
- Any endpoint that changes or stores workplace data.

The tables are deliberately read-only. This repository demonstrates the interface and the way the work is organized; it is not a copy of the private system.

## Tests

```bash
npm test
```

The tests check the health route, security headers, automatic language choice, explicit preview routes, the five sections, the fictional records and the absence of private application endpoints.

## Project structure

- `src/app.js` configures the public Express server and language routes.
- `public/en.html` contains the English dashboard preview.
- `public/pt-br.html` contains the Brazilian Portuguese dashboard preview.
- `public/marketing-preview.js` controls the sidebar tabs.
- `test/app.test.js` covers the public routes and privacy boundary.

## License

This project is available under the MIT License.
