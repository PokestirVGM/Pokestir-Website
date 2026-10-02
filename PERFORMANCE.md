# Performance validation

Validated on October 2, 2026 against commit
`c6b294c315715b643bf6dba73a95bde66c20789b`. The site still serves static HTML,
CSS, and vanilla JavaScript, with the same music, catalog, listening links,
controls, layout, motion, accessibility behavior, and forms.

The largest changes are the compact archive search catalog, committed minified
assets, a dedicated detail player, responsive artwork, deferred portrait
loading, and cached catalog cards. Search and sort reuse card nodes and sorted
data. Animation geometry is measured only through the visible rows. Plain gear
cards no longer participate in the ambient-animation observer, and ambient
card animations pause while the document is hidden. Audio files and preview
quality are unchanged. Google Analytics remains enabled with lower fetch
priority.

The detail generator now includes listening links and track rows in the HTML.
The 4.8 KB detail script adds playback and refreshes compilation links if their
availability changes. Detail pages no longer download the archive renderer.
Render ordering needed for the existing artwork/navigation transitions is
preserved. The rare missing-page fallback loads a complete catalog on demand,
so legacy URLs retain their listening links and previews.

Measured browser payloads, before HTTP compression:

| Resource | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Shared navigation JS | 42,479 B | 10,732 B | 75% |
| Shared CSS | 43,116 B | 16,748 B | 61% |
| Archive catalog | 413,698 B | 162,490 B | 61% |
| Detail page JS | 51,139 B | 4,808 B | 91% |
| Navigation icon, 1× display | 35,814 B | 1,898 B | 95% |
| Navigation icon, 2× display | 35,814 B | 4,342 B | 88% |
| Juicy16 screenshot | 160,336 B | 107,996 B | 33% |

The screenshot's decoded pixel buffers were identical after lossless WebP
conversion. Navigation derivatives use lossless WebP; the original icon remains
in the responsive source set for higher densities. Artwork uses 250, 500, 750,
and 1000 px CDN crops selected for rendered size and display density. The
closed portrait does not download, and it remains deferred while hidden on
mobile. Opening About after widening the viewport loads it normally.

Compression does not erase the improvements: the shared navigation shrank
from 14,324 B to 3,859 B with gzip, shared CSS from about 14.3 KB to 4.3 KB,
and the archive catalog from about 64.8 KB to 28.1 KB.

Representative cold-load lab results used headless Chrome at 1280 × 900,
6× CPU slowdown, 150 ms added latency, and 200,000 B/s download throughput.
Each page used a fresh browser context with its cache disabled. These are
local-server measurements without HTTP compression, not production field
measurements; external artwork and analytics timing vary.

| Page | First contentful paint before | After |
| --- | ---: | ---: |
| Home | 2.872 s | 1.036 s |
| Releases archive | 4.592 s | 2.704 s |
| Software & Gear | 1.608 s | 0.948 s |
| Battle Themes Vol. III detail | 2.064 s | 1.012 s |
| Usage Terms | 1.144 s | 0.808 s |
| Contact | 1.352 s | 0.712 s |
| Links | 1.456 s | 0.808 s |
| Juicy16 | 1.696 s | 0.916 s |

Loading layout shift was zero on every page in the final run. Gear's baseline
was 0.135. Loading placeholders reserve space below the controls, and the
vendor control has its final width before the CSV arrives.

A warm search for `kingdom` followed by Clear measured these script operations
at 1280 × 900:

| Operation | Before | After |
| --- | ---: | ---: |
| Archive card geometry reads | 536 | 26 |
| New archive card anchors | 285 | 0 |
| Gear card geometry reads | 80 | 18 |
| New gear cards | 40 | 0 |

Browser regression checks compared the original and optimized release text,
search results, sort order, track rows, preview URLs, platform links,
compilation overrides, and gear data. Checks also exercised album arrows,
return scroll/filter state, legacy and missing-page routes, categories,
subtags, favorites, pagination, About, Commissions, portfolio playback, pause,
seeking, next-track selection, mobile layouts, navigation, and reduced motion.
Static release details were verified with JavaScript disabled. The completed
regression suite reported no browser JavaScript errors. Contact and Juicy16
form layouts were inspected without submitting them.

A separate mobile stress run used 390 × 844 at 3× display density, 12× CPU
slowdown, software rendering, 400 ms latency, and 100,000 B/s. It requested
only six nearby covers out of 283 archive tiles, selected 750 px artwork for
the high-density display, and passed filtering, portrait deferral, and live
Spotify preview playback/pause/switching. Additional checks forced compilation
link refresh and moved the visitor's calendar to 2020; the detail pages matched
the original compilation and release-availability behavior without errors.

Run `npm run build` after editing JavaScript, CSS, or generators, then
`npm run check`. The checks validate all 352 recordings and 266 releases,
generated pages/catalogs, minified assets, complete search/detail data, and
browser asset size budgets. CI runs the same checks. The pinned esbuild
dependency is development-only; no Node process is needed in production.

Local benchmark and browser scripts/results remain in the Codex task workspace
for inspection. Third-party artwork, Spotify previews, Analytics, and YouTube
still depend on their providers and the visitor's network. Existing media,
streaming destinations, forms, and analytics were retained.
