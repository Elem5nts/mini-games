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
      question/answer list, with 18 curated beginner entries.
- [x] **Items content** — full resource coverage (59 items across 8
      categories) with `where` + `hidden` filled.
- [x] **Getting Started checklist** — `modules/checklist.js` reads
      `data/checklist.json`; steps grouped by phase (First Hour / First Few
      Hours / First Week), ordered, with localStorage-persisted checkboxes.
- [x] **Glossary** — `modules/glossary.js` reads `data/glossary.json`;
      searchable list with category filter (41 curated terms).

## Backlog

- [ ] **Class explainer** — what ship/multitool/etc. classes (C/B/A/S) mean and
      when each is worth it. Likely `data/classes.json` + `modules/classes.js`.
- [ ] **Collection tracker** — mark what you've collected / still need.
      `data/collections.json` + `modules/collections.js` (may need local
      persistence via `localStorage`).

## Ideas / maybe later

- [ ] Sort options (by value, rarity, verdict).
- [ ] Favourites / pinning.
- [ ] Offline support (service worker) for true mobile field use.
- [ ] Per-item detail view.

## Content backlog (data, not code)

- [x] Populate `data/items.json` with curated, paraphrased entries (59 items).
- [x] Populate `data/faq.json` (18 entries) and `data/checklist.json` (19 steps).
- [ ] Verify approximate item values in-game and clear the `(unsicher)` flags.
