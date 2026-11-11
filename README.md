# Threadform pet cross-stitch MVP

Private preview: https://threadform-stitch-prototype.inventivecod4.chatgpt.site

Run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist` from this folder. No dependencies or build step. Run the mathematical regression tests with `node --test tests/engine.test.js`.

## Primary task

Create a printable pattern of the user's own cat or dog. Upload JPG/PNG/WebP (20 MB, 60 MP cap), crop around the subject, mark background unstitched, review the pattern, and download the PDF. Sample photos have curated crops; uploaded photos start uncropped.

- Crop with a pointer or accessible percentage inputs.
- Erase and restore background with a brush; undo, reset crop, restore background, cancel, and apply edits.
- Optional plain-background shortcut uses border-connected color similarity. It is not semantic pet segmentation. Complex scenes need manual correction. It may remove similar-colored fur, which must be checked and restored.
- Choose a longest grid side of 40–240 stitches, up to 24 thread colors, and 14/16/18-count fabric. Width and height preserve the crop ratio; the selected longest side is respected.
- Perceptual Lab palette selection from approximate DMC references, with additional neutral and brown shades. No dithering. Optional subtle isolated-stitch cleanup preserves high-contrast single cells; this does not guarantee all important detail survives quantization.
- Explicit blank fabric is represented by -1. White thread remains a real color. Stitch totals exclude blanks and match the thread key and PDF chart.
- Preview the cropped source photo, digital stitch simulation, and symbol chart; vector PDF includes cover, thread key, actual stitch counts, blank-square instructions and numbered tiled charts on US Letter.

Checkout remains an explicit simulation: no money, card details or uploaded photos are sent to a server. There are no accounts, analytics, storage or payment integrations. Only the static assets and external interface fonts are fetched.

## Validation, 2026-11-11

Six mathematical regression tests passed: portrait/landscape dimensions (including the old 107×161 rounding case), white vs blank fabric/counts, spatial color mapping and palette limit, preservation of contrasting single-cell eyes, border connectivity, and fully erased image rejection.

Browser checks covered six actual cat/dog photographs, numeric crop, erase, undo, cancel/apply, plain-background removal, transparency, maximum size, fabric change, chart mode, simulated checkout and PDF creation. A 120×117 edited cat pattern contained 7,650 stitches and 6,390 blank squares; the eight-page PDF and palette totals agreed, its xref was checked and its cover rendered. The 390×844 mobile viewport and editor had no horizontal overflow. Local QA artifacts are ignored in `qa/`; screenshots are under the local browser MCP output folder.

These checks establish functional behavior, not a commercial quality advantage. No physical shade-card calibration, actual test stitching, Pattern Keeper certification, competitor output comparison, external customer use or paid conversion has been completed. Small faces, fine whiskers, subtle fur and busy backgrounds still require review. No claim that pets are the largest US cross-stitch segment is made.

Example photos are from Unsplash; see `dist/assets/README.md`. Digital previews are not photographs of stitched samples.
