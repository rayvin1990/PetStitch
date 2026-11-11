# Threadform cross-stitch MVP prototype

Open the hosted private Site, or run `python3 -m http.server 4173 --bind 0.0.0.0 --directory dist` from this folder.

The actual browser-local flow supports JPG/PNG/WebP upload (20 MB cap), median-cut color quantization, approximate floss matching, conservative isolated-stitch cleanup, width/color/fabric adjustments, original/stitch/symbol previews and vector PDF downloads (cover, thread key, tiled symbol charts).

Checkout is explicitly a simulation. No money, card details or photos are sent to a server. No accounts, analytics, cloud storage or payment integrations exist.

Palette references are approximate RGB suggestions rather than certified DMC colorimetry. Pattern Keeper compatibility and actual stitchability are not certified. Pattern output must be reviewed/test stitched before paid commercial use. Extreme aspect ratios are capped at 160 stitches on the longest axis.

The sample fox illustration is original code-native SVG embedded in app.js. Interface fonts load from Google Fonts with local fallbacks; photo processing does not depend on external services.
