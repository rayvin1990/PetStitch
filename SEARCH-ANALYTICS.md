# Search and analytics setup

Canonical site: https://www.pet2stitch.com/

Google Search Console Domain resource pet2stitch.com is visible in the user's screenshot. Sitemap submission and indexing are not yet confirmed. Submit https://www.pet2stitch.com/sitemap.xml.

GA4 measurement ID: G-YZQ5DVKZQ4, provided by user. Correct gtag/js loader and config installed; Google Signals and ad personalization signals disabled. A standard page_view is sent on configuration.

Custom events (production custom domain only):
- photo_preview: successful initial preview of a user-selected photo.
- example_preview: user deliberately opens a sample; automatic hero rendering is excluded.
- pdf_download: PDF generated and browser download triggered; source_type distinguishes user_photo from example. This is not proof the file was saved and is not a purchase.

Custom event payload contains only source_type; no filenames, photos or image data. GA4 also collects its standard browser/page metadata. Repeated size/color edits do not count as new initial photo previews. Analytics blocking must not prevent use of the tool.

Live collection verification and the user's GA4 Realtime confirmation are pending. Google account remains signed out in the automation profile.
