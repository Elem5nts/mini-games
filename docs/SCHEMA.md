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
  "where": "string",
  "hidden": "string",
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
| `where`    | string          | How/where you obtain it in-game (short). Empty `""` if unknown. |
| `hidden`   | string          | The non-obvious tip — what the game does **not** tell you. Empty `""` if unknown. |
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
    "where": "Mined from rocky deposits on most planets.",
    "hidden": "Refines 1:1 into a more valuable form — don't sell it raw.",
    "source": "Paraphrased from public wiki",
    "updated": "2026-06-04"
  }
]
```

### Conventions

- Unknown/optional fields may be omitted; the app degrades gracefully.
- `where` and `hidden` may be empty strings `""` until researched.
- Keep `rarity` and `verdict` to the documented enum values so styling works.
- Paraphrase source material — never copy text verbatim (see
  [../DATA-SOURCES.md](../DATA-SOURCES.md)).

## `data/faq.json`

A JSON **array** of FAQ entry objects. An empty file is `[]` (valid — the app
shows a friendly placeholder).

### FAQ entry object

```json
{
  "id": "string",
  "question": "string",
  "answer": "string",
  "category": "string",
  "source": "string",
  "updated": "YYYY-MM-DD"
}
```

### Fields

| Field      | Type   | Notes |
|------------|--------|-------|
| `id`       | string | Stable unique key (e.g. `"how_to_warp"`). |
| `question` | string | The question, shown as the card heading. |
| `answer`   | string | The answer body. |
| `category` | string | Free-text group (shown as a tag). Optional. |
| `source`   | string | Where the info came from (paraphrased). |
| `updated`  | string | ISO date `YYYY-MM-DD` of last review. |

### Example entry

```json
[
  {
    "id": "example_question",
    "question": "How do I do the thing?",
    "answer": "Short, paraphrased explanation of how to do the thing.",
    "category": "Basics",
    "source": "Paraphrased from public wiki",
    "updated": "2026-06-04"
  }
]
```

## `data/checklist.json`

A JSON **array** of "Getting Started" step objects, grouped by phase in the
app. An empty file is `[]` (valid — the app shows a friendly placeholder).

### Step object

```json
{
  "id": "string",
  "phase": "First Hour | First Few Hours | First Week",
  "order": 0,
  "title": "string",
  "what": "string",
  "why": "string",
  "tip": "string"
}
```

### Fields

| Field   | Type    | Notes |
|---------|---------|-------|
| `id`    | string  | Stable unique key (e.g. `"fh_recharge"`). Also used as the localStorage checkbox key. |
| `phase` | enum    | One of `First Hour`, `First Few Hours`, `First Week`. Drives grouping/order. |
| `order` | integer | Sort order within a phase (ascending). |
| `title` | string  | Short step heading shown next to the checkbox. |
| `what`  | string  | The concrete action to take. |
| `why`   | string  | Why the step matters. |
| `tip`   | string  | Optional non-obvious hint. May be omitted/empty. |

### Phase → grouping

| `phase`          | Shown |
|------------------|-------|
| `First Hour`     | First section |
| `First Few Hours`| Second section |
| `First Week`     | Third section |
| (other)          | Appended after the known phases |

Checkbox state is stored per browser in `localStorage` under
`nms_checklist_done` (a map of `{ id: true }`); it is presentation state, not
data, so it never lives in the JSON.

### Example entry

```json
[
  {
    "id": "fh_recharge",
    "phase": "First Hour",
    "order": 1,
    "title": "Recharge your survival systems",
    "what": "Refill Life Support with Oxygen and Hazard Protection with Sodium.",
    "why": "Both drain outside your ship; hitting zero costs health.",
    "tip": "Caves pause environmental hazards entirely."
  }
]
```

## `data/glossary.json`

A JSON **array** of glossary term objects. An empty file is `[]` (valid — the
app shows a friendly placeholder).

### Term object

```json
{
  "id": "string",
  "term": "string",
  "category": "string",
  "plain": "string",
  "note": "string"
}
```

### Fields

| Field      | Type   | Notes |
|------------|--------|-------|
| `id`       | string | Stable unique key (e.g. `"warp_cell"`). |
| `term`     | string | The term/UI name, shown as the card heading. |
| `category` | string | Group, powers the category filter. E.g. `Currencies`, `Crafting`, `Ships & Tech`, `Bases`, `NPCs/Factions`, `UI`. |
| `plain`    | string | Short plain-language explanation. |
| `note`     | string | Optional — why it matters / common beginner confusion. May be omitted/empty. |

### Example entry

```json
[
  {
    "id": "warp_cell",
    "term": "Warp Cell",
    "category": "Ships & Tech",
    "plain": "The fuel a Hyperdrive burns to warp between star systems.",
    "note": "Crafted from Antimatter + Antimatter Housing; each fills about 20% of the tank."
  }
]
```
