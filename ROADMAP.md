# Roadmap

Each feature is a **new module file** + (optionally) a **new data file** — no
core rewrites. See [ARCHITECTURE.md](ARCHITECTURE.md) for the recipe.

## Done

- [x] **App v1 — Item list**: search, category filter, verdict traffic light,
      reads `data/items.json`, friendly empty/missing-data placeholder.
- [x] Project scaffold: folders, schema, architecture & source docs.

## Backlog

- [ ] **Class explainer** — what ship/multitool/etc. classes (C/B/A/S) mean and
      when each is worth it. Likely `data/classes.json` + `modules/classes.js`.
- [ ] **Beginner checklist** — an early-game "do these first" list.
      `data/checklist.json` + `modules/checklist.js`.
- [ ] **Glossary** — plain-English definitions of game terms.
      `data/glossary.json` + `modules/glossary.js`.
- [ ] **Collection tracker** — mark what you've collected / still need.
      `data/collections.json` + `modules/collections.js` (may need local
      persistence via `localStorage`).

## Ideas / maybe later

- [ ] Sort options (by value, rarity, verdict).
- [ ] Favourites / pinning.
- [ ] Offline support (service worker) for true mobile field use.
- [ ] Per-item detail view.

## Content backlog (data, not code)

- [ ] Populate `data/items.json` with curated, paraphrased entries.
