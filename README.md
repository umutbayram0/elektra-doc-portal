# Elektra Doc Portal

An internal documentation portal for Elektraweb engineers, covering projects, modules, components, API and libraries. Built with Angular (standalone components, signals, zoneless change detection) and Angular Material.

## Development server

```bash
npm start
```

Open `http://localhost:4200/`. The app reloads automatically as you edit source files.

## Building

```bash
npm run build
```

Production build output goes to `dist/elektra-doc-portal`.

## Testing

```bash
npm test
```

Runs the Vitest-based unit test suite (`@angular/build:unit-test`).

## Linting

```bash
npm run lint
```

Runs ESLint (`@angular-eslint`) over the project.

## Content structure

Each documentation section (`Projects`, `Modules`, `Components`, `API`, `Libraries`) lives under `src/app/features/<section>/` and follows the same shape:

- `<section>-content.json` — the actual page content, an array of `cards`.
- `<section>-content.schema.json` — a JSON Schema the content must satisfy (enforced by `src/app/core/content/content-validation.spec.ts`).
- `<section>-content.model.ts` — the TypeScript type matching the schema.
- `<section>.ts` — the section's index page, listing its top-level cards.
- `<section>.routes.ts` — two routes: `''` (the index page) and `'**'` (a wildcard, matched by `shared/node-detail.ts`, which renders whichever nested card the URL resolves to).

Cards are `DocNode`s (`src/app/shared/doc-node.model.ts`) and can nest arbitrarily deep via `children`. Every node gets its own real URL, e.g. `/modules/authentication/route-guards`, not a fragment/anchor scroll. `shared/node-detail.ts` walks the node tree to match the URL, renders the node's title/description/code example, its children as link-cards one level deeper, and a breadcrumb trail back up.

### Adding a new doc page

1. Add a node (with a unique `id`, `title`, `description`, and optionally `example`/`exampleLang`/`exampleFilename`/`children`) to the relevant `<section>-content.json`.
2. Run `npm test` — the schema validation spec will catch structural mistakes (missing `id`, unknown fields, etc.) before you even open the browser.

`Overview` is the one exception: it's a static landing page with no children, sourced from `overview-content.json`'s `title`/`description`/`purpose` fields.

## Search

The sidebar search box (`shared/search-box.ts`) matches against a flattened index of every node's title and description, built once at startup (`core/search/search-index.ts`, `core/search/search.service.ts`). It only indexes the five route-based sections — `Overview` has no children to index.
