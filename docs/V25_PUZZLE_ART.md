# Puzzle face art pass

Baseline: GitHub `junl-im/CardVille` main `b026721a88f3de54b322f7951ba4adfcc7ca4787` (2026-10-15).

Reference check: the [current Notion project page](https://app.notion.com/p/3fafff243ec981c9965dc6981ab01f8d) identifies the canonical game, while the [v2.4 button source record](https://app.notion.com/p/3f9fff243ec981f3a9e3cb08cdf2b048) and its [Google Drive archive](https://drive.google.com/drive/folders/1bJQFjHvoKPDsL5uD3CugKzDnuvLW8WfI) identify source sheets as archived design references. The user-provided 2026-10-15 animal boards and puzzle mockups guided this art pass.

The seven puzzle faces are independent, transparent, 384 × 384 WebP files in `web/assets/v25/animals`. Each was generated separately in the style of the user's 2026-10-15 LanyPang references. They replace the 256 × 176 low-detail faces on the puzzle board only. Gallery art and game rules remain as they were on main.

The art prompt for each face specified a single front-facing animal head, glossy 3D candy-game rendering, rounded silhouette, large brown eyes, rosy cheeks, small smiling mouth, even transparent margin, and 48px readability. Animal identities were rabbit, bear, chick, puppy, black cat, fox, and gray wolf. The black cat was revised after the user pointed out that a white cat was too similar to the rabbit. It has charcoal fur, pink ears, and a contrasting lighter tile. No text, props, body, frame, background, sprite sheet, or vector art was requested. The first rabbit established the reference style for the other six.

The source PNGs were generated individually and cleaned of detached alpha specks before WebP export. The 14 committed WebP files are the runtime assets. No SVG files are added.

The board skin uses a pink candy frame and alternating plum tiles to give the light animal faces contrast. The 8 × 8 board, interaction handlers, and scoring logic are unchanged.

Each animal also has a separately generated transparent `-wink.webp` expression. `LanyPolish.onMatch` swaps the matching tile face to its wink variant during the existing match animation. The normal and wink crops share one square bounding box per animal, avoiding a visible size jump. The seven wink files are preloaded when the page initializes, and normal faces return through the existing board render path.
