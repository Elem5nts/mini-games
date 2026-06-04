# Data schema

All app data lives as JSON in `data/`. This document is the **contract**
between the data and the app. Keep it in sync whenever the shape changes.

## `data/items.json`

A JSON **array** of item objects. An empty file is `[]` (valid — the app
shows a friendly placeholder).

### Item object

```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "value": 0,
  "rarity": "common | uncommon | rare | very_rare",
  "verdict": "keep | sell | ignore",
  "uses": ["string", "..."],
  "tips": "string",
  "source": "string",
  "updated": "YYYY-MM-DD"
}
```

### Fields

| Field      | Type            | Notes |
|------------|-----------------|-------|
| `id`       | string          | Stable unique key (e.g. `"chromatic_metal"`). |
| `name`     | string          | Display name shown in the list. |
| `category` | string          | Free-text group; powers the category filter. |
| `value`    | number          | Approximate value (units). Shown as a tag. |
| `rarity`   | enum            | One of `common`, `uncommon`, `rare`, `very_rare`. |
| `verdict`  | enum            | One of `keep`, `sell`, `ignore`. Drives the traffic light. |
| `uses`     | array of string | What the item is used for. |
| `tips`     | string          | Short curated advice. |
| `source`   | string          | Where the info came from (paraphrased). |
| `updated`  | string          | ISO date `YYYY-MM-DD` of last review. |

### Verdict → traffic light

| `verdict` | Lamp colour |
|-----------|-------------|
| `keep`    | 🟢 green     |
| `sell`    | 🟡 yellow    |
| `ignore`  | ⚪ grey      |
| (missing/other) | dark/unknown |

### Example entry

```json
[
  {
    "id": "example_item",
    "name": "Example Item",
    "category": "Resource",
    "value": 120,
    "rarity": "uncommon",
    "verdict": "keep",
    "uses": ["Crafting", "Refining"],
    "tips": "Handy early on; stockpile a small buffer.",
    "source": "Paraphrased from public wiki",
    "updated": "2026-06-04"
  }
]
```

### Conventions

- Unknown/optional fields may be omitted; the app degrades gracefully.
- Keep `rarity` and `verdict` to the documented enum values so styling works.
- Paraphrase source material — never copy text verbatim (see
  [../DATA-SOURCES.md](../DATA-SOURCES.md)).
