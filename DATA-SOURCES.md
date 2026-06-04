# Data sources

This tool is for **private use only**. Game information is gathered from public
community sources and then **paraphrased** into our own concise wording — we do
**not** copy text verbatim.

## Principles

- **Paraphrase, don't copy.** Summarise facts (values, rarity, uses) in our own
  words. No wholesale copy/paste of articles or tables.
- **Facts, not prose.** We store data points (e.g. "used in crafting X"),
  not someone else's writing.
- **Attribute the origin.** Each item's `source` field notes where the info
  came from, in general terms.
- **Date it.** The `updated` field records when an entry was last reviewed,
  because game values change between patches.

## Typical sources

- The community **No Man's Sky Wiki** (e.g. `nomanssky.fandom.com`) and the
  official wiki, for item values, rarity and uses.
- In-game observation and patch notes.
- General community guides — facts only, paraphrased.

## What we store vs. what we don't

| Do store                              | Don't store                          |
|---------------------------------------|--------------------------------------|
| Numeric values, rarity, categories    | Verbatim article text                |
| Short paraphrased tips                 | Copied paragraphs / screenshots      |
| What an item is used for               | Anything implying official endorsement |

## Maintenance

When updating after a game patch, refresh the affected entries and bump their
`updated` date. Keep the schema in [docs/SCHEMA.md](docs/SCHEMA.md) authoritative.
