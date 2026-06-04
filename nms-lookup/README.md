# NMS Lookup

A private, local, **English-only** reference tool for **No Man's Sky**.
Quickly look up how rare / valuable / useful something is, plus curated tips.

> Private use only. Not published, not affiliated with Hello Games.
> Data is paraphrased from public sources — see [DATA-SOURCES.md](DATA-SOURCES.md).

## What it does (v1)

- Item list with **search**, **category filter**, and a **verdict traffic light**
  (keep = green, sell = yellow, ignore = grey).
- Reads everything from `data/items.json`. Empty or missing data shows a
  friendly placeholder instead of breaking.

## How to run it locally

No build step, no dependencies. The app uses `fetch()` to load JSON, so it
needs to be served over `http://` (opening `index.html` via `file://` is
blocked by the browser).

Pick one:

```bash
# from the nms-lookup/ folder
python3 -m http.server 8000
# then open:  http://localhost:8000/app/
```

```bash
# or, if you have Node
npx serve .
# then open the printed URL and navigate to /app/
```

On your phone: run the server on your computer and open
`http://<computer-ip>:8000/app/` while on the same Wi-Fi.

## Folder layout

```
nms-lookup/
├─ app/        # the web app (HTML/CSS/JS) — no game logic, only reads JSON
├─ data/       # JSON data the app consumes (items.json, …)
├─ scripts/    # helper scripts (empty for now)
└─ docs/       # SCHEMA, architecture, sources, roadmap
```

## Adding data

Edit `data/items.json` following the schema in
[docs/SCHEMA.md](docs/SCHEMA.md). The list refreshes on reload.

## Project docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — how the pieces fit together
- [docs/SCHEMA.md](docs/SCHEMA.md) — the item data contract
- [DATA-SOURCES.md](DATA-SOURCES.md) — where data comes from
- [ROADMAP.md](ROADMAP.md) — planned features / backlog
