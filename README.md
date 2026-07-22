# Elektra Doc Portal

An internal documentation portal for Elektraweb engineers. Built with Angular (standalone components, signals, zoneless change detection) and Angular Material.

The navigation is organized around the four [Diátaxis](https://diataxis.fr/) documentation types:

- **Getting Started** — a short, learning-oriented onboarding path (tutorial).
- **Guides** — task-oriented, step-by-step instructions (how-to).
- **Projects / Modules / Components / API / Libraries** — information-oriented lookup content (reference).

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

Each documentation section (`Getting Started`, `Guides`, `Projects`, `Modules`, `Components`, `API`, `Libraries`) lives under `src/app/features/<section>/` and follows the same shape:

- `<section>-content.json` — the actual page content, an array of `cards`.
- `<section>-content.schema.json` — a JSON Schema the content must satisfy (enforced by `src/app/core/content/content-validation.spec.ts`).
- `<section>.routes.ts` — two routes, both reusing shared components (no per-section component code):
  - `''` renders `shared/feature-index.ts`, the section's index page listing its top-level cards.
  - `'**'` renders `shared/node-detail.ts`, a wildcard matched against whichever nested card the URL resolves to.

Cards are `DocNode`s (`src/app/shared/doc-node.model.ts`) and can nest arbitrarily deep via `children`. Every node gets its own real URL, e.g. `/modules/authentication/route-guards`, not a fragment/anchor scroll. `shared/node-detail.ts` walks the node tree to match the URL and renders:

- title, description and a syntax-highlighted, copyable code example (`example`/`exampleLang`/`exampleFilename`)
- optional `notes` — inline Tip / Note / Warning callouts
- optional `properties` — an AG Grid–style reference table (`name`/`type`/`default`/`description`), for documenting a component's inputs or an endpoint's payload fields
- optional `related` — cross-links to other pages, rendered as a "Related topics" list
- its children as link-cards one level deeper, and a breadcrumb trail back up
- an auto-generated "On this page" table of contents, built from whichever of the sections above are present

See [Guides → How to Add a New Documentation Section](src/app/features/guides/guides-content.json) and [How to Document a Component's Inputs](src/app/features/guides/guides-content.json) for worked examples of each field.

### Adding a new doc page

1. Add a node (with a unique `id`, `title`, `description`, and optionally `example`/`exampleLang`/`exampleFilename`/`notes`/`properties`/`related`/`children`) to the relevant `<section>-content.json`.
2. Run `npm test` — the schema validation spec will catch structural mistakes (missing `id`, unknown fields, etc.) before you even open the browser.

`Overview` is the one exception: it's a static landing page with no children, sourced from `overview-content.json`'s `title`/`description`/`purpose` fields.

### "Edit this page" links

`shared/repo-links.ts` exports `REPO_EDIT_BASE_URL`, empty by default. Once this repo has a GitHub remote, set it to the repo's blob base (e.g. `https://github.com/<org>/<repo>/blob/main/src/app/features`) and every doc page will show an "Edit this page on GitHub" link automatically.

## Search

The sidebar search box (`shared/search-box.ts`) matches against a flattened index of every node's title and description, built once at startup (`core/search/search-index.ts`, `core/search/search.service.ts`). It indexes every route-based section — `Overview` has no children to index.
