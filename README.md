# Pokestir Website

This is the source code for my personal website at [pokestir.com](https://pokestir.com), hosted on GitHub Pages.

The site is static HTML, CSS, and vanilla JavaScript. Edit the readable source
files, then regenerate the committed browser assets before previewing:

```sh
npm ci
npm run build
npm run check
python3 scripts/dev-server.py
```

`npm run build` generates release pages, the compact archive catalog, and
minified JavaScript/CSS with [esbuild](https://esbuild.github.io/api/#transform).
Node and esbuild are only needed for development; GitHub Pages serves the
generated files directly. CI detects stale generated files. Do not hand-edit
`.min.js`, `.min.css`, or generated release pages. The full music catalog stays
in `releases/data.js` and `releases/tracks-data.js`; the archive's smaller search
catalog omits streaming URLs and preview audio that only detail pages use.

The local server supports HTTP range requests so playback and seeking can be
tested accurately. Performance and regression checks are described in
[PERFORMANCE.md](PERFORMANCE.md).
