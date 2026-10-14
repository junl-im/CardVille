# LanyPang v2.4 — Button concept source sheets (2026-10-15)

**Status: source images archived, not approved production sprites, not applied to gameplay.**

These four generated PNG sheets are preserved intact. Keep the approved WebP/PNG mascot and UI assets. Do not replace existing UI or revert to SVG.

| File | Role | SHA-256 | Google Drive |
|---|---|---|---|
| [01_menu_buttons_3set.png](./01_menu_buttons_3set.png) | Start/tutorial/install designs | `7a23a1615c149d5b52da712ceddd8f5c547c681b5e62ee04f3fb25cd23e01903` | [Source](https://drive.google.com/file/d/1ltZVxkARUU6G1iUjP0SwzZD6Eyft1wH9/view) |
| [02_korean_game_buttons_sheet.png](./02_korean_game_buttons_sheet.png) | Stage and gameplay actions | `0eab4bde131e5dfa974918c15cbc95672f28e197f1b1549807d5c0935899099e` | [Source](https://drive.google.com/file/d/1981yH6fJP6jeruPV-AiLWcEdhBB5-jWt/view) |
| [03_regions_and_main_buttons_sheet.png](./03_regions_and_main_buttons_sheet.png) | 10 world tabs, 25-stage page groups, main actions | `da60af0a77a100441b4a364186575143e67c997cdd411e33fb4b04abe169293f` | [Source](https://drive.google.com/file/d/1OP4h39us5xAT7he-zQG0lR8BR20TaYfa/view) |
| [04_icon_and_nav_buttons_sheet.png](./04_icon_and_nav_buttons_sheet.png) | Navigation and utility icon controls | `796f7eba6e741984854318df37bed5de04646b2412fa17bdcd17518d9c171a40` | [Source](https://drive.google.com/file/d/1g6GvmFQ7gSkNiMreCk5VuHqNZajFmrcK/view) |

Drive source folder: https://drive.google.com/drive/folders/1bJQFjHvoKPDsL5uD3CugKzDnuvLW8WfI

Drive ZIP: https://drive.google.com/file/d/1IrjF1JMHQFqhkq1LEfJZJ_i_IAJWggiT/view
ZIP SHA-256: `547be13ba8445734e6a8dcb1d697736ba3adbb011c18ecaf6e7218c52ec5f2fb`

**Integration guidelines:**
1. 10 fixed regions, 25 stages each, 250 total stages. Region page groups are 1–9, 10–17, and 18–25.
2. Slice only after inspecting boundaries and Korean label spelling. Sheet art contains decorative printed letters; use HTML accessible labels where possible, never stretch or duplicate text.
3. Reuse already approved production assets where matched; new concept designs must be evaluated against current 320×440 through desktop screenshots.
4. Do not change stage ids, completion data, rankings, save keys, modal functions, or Firebase LIVE without full QA.
5. This commit is **archive only** — no runtime imports, CSS changes, or deployment.

Prior confirmed libraries:
- Notion: https://app.notion.com/p/3f9fff243ec981449570ee327703ecc6
- Prior approved source set: web/assets/ui/v21/source-original-kit.zip
- v2.3 raster references: web/assets/v23/
