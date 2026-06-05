# Roadmap

Each feature is a **new module file** + (optionally) a **new data file** — no
core rewrites. See [ARCHITECTURE.md](ARCHITECTURE.md) for the recipe.

## Done

- [x] **App v1 — Item list**: search, category filter, verdict traffic light,
      reads `data/items.json`, friendly empty/missing-data placeholder.
- [x] Project scaffold: folders, schema, architecture & source docs.
- [x] **Item schema extension** — added `where` (how/where to obtain) and
      `hidden` (the non-obvious tip) fields, replacing `tips`. App renders both.
- [x] **FAQ tab** — `modules/faq.js` reads `data/faq.json`; searchable
      question/answer list. Structure only; content to be added.

## Backlog

- [ ] **FAQ content** — populate `data/faq.json` with curated, paraphrased Q&A.
- [ ] **Items content** — fill `where` + `hidden` for existing entries.
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
