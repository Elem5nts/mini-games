# Architecture

## Goals / constraints

- **Vanilla** HTML/CSS/JS. No build step, no frameworks, no dependencies.
- **Strict separation of concerns**: the app reads data only; it contains
  **no game logic**. It never hard-codes what is rare or valuable — that
  lives in the data.
- **No dead ends**: adding a feature means adding a file, never rewriting the
  core.

## The two layers

```
        data/ (JSON)                     app/ (presentation)
   ┌──────────────────┐            ┌───────────────────────────┐
   │ items.json        │  fetch →  │ core.js  (kernel)          │
   │ (future: more)    │           │   ├─ module registry       │
   └──────────────────┘           │   ├─ cached JSON loader    │
                                    │   └─ tab bar + switching   │
                                    │ modules/items.js (feature) │
                                    └───────────────────────────┘
```

1. **Data layer** — plain JSON files in `data/`. The source of truth.
   The schema is documented in [docs/SCHEMA.md](docs/SCHEMA.md).
2. **App layer** — `app/`. Loads JSON and renders it. Nothing else.

## The kernel (`app/js/core.js`)

`core.js` exposes a tiny global `NMS` with exactly:

- `registerModule({ id, label, mount })` — a feature registers itself.
- `loadJSON(name)` — fetches & **caches** `../data/<name>.json`; resolves to
  `null` on any error so modules can show a placeholder.
- `placeholder(message)` — builds a friendly empty-state element.
- `start()` — renders the tab bar and opens the first module.

The kernel never inspects field meanings. It just routes between modules and
hands each one a container plus `{ loadJSON, placeholder }`.

## Modules = features (`app/js/modules/*.js`)

Each feature is **one self-contained file** that:

1. Defines a `mount(rootEl, ctx)` function that builds its own UI.
2. Calls `NMS.registerModule(...)` at the bottom.

Then it is wired in by adding **one `<script>` tag** to `index.html`. That is
the only "core" change a new feature requires.

### Adding a feature (the recipe)

1. Create `app/js/modules/<feature>.js`.
2. Read whatever JSON you need via `ctx.loadJSON('<name>')`.
3. Add the matching data file in `data/` and document its schema.
4. Add `<script src="js/modules/<feature>.js"></script>` to `index.html`,
   before the `NMS.start()` call.

No existing module or the kernel needs to change. All modules read the same
`data/` JSON files.

## Why served over HTTP

The app uses `fetch()` for JSON. Browsers block `fetch()` from `file://`, so
the app must be served (see [README.md](README.md) for one-liners). This keeps
data as editable plain files rather than inlined into JS.
