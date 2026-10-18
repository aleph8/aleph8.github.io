---
title: "Use Lifelike on a website"
sidebar_label: "Web integration"
description: "Embed a Lifelike viewer with HTML, JavaScript, and WebAssembly."
order: 2
translationKey: lifelike-web
---

Lifelike works on a static website without dependencies or a bundler. The engine runs in **WebAssembly**, while the viewer uses HTML, CSS, and JavaScript.

## Prepare the files

1. Download the compiled package from [release v0.1.0](https://github.com/aleph8/lifelike/releases/tag/v0.1.0) and extract its files into `life/pkg/`. No Rust installation is needed.
2. Copy `viewer.js` and `viewer.css` from the repository’s [examples directory](https://github.com/aleph8/lifelike/tree/main/examples) into `life/`.
3. Serve this directory as static website files, keeping the generated JavaScript and WASM binary together:

```text
life/
  viewer.js
  viewer.css
  pkg/
    lifelike_wasm.js
    lifelike_wasm_bg.wasm
```

The package also includes TypeScript declarations, metadata, and a license. Keep the license when distributing it.

## Add the viewer

Include this snippet in your page. It loads the **HighLife replicator**, initially paused:

```html
<link rel="stylesheet" href="/life/viewer.css">
<div id="life"></div>
<script type="module">
  import { mountLife, LifeRule } from "/life/viewer.js";

  const viewer = await mountLife(document.querySelector("#life"), {
    width: 64,
    height: 48,
    cellSize: 8,
    interval: 120,
    rule: LifeRule.HighLife,
    cells: [
      [22, 32], [22, 33], [22, 34],
      [23, 31], [23, 34],
      [24, 30], [24, 34],
      [25, 30], [25, 33],
      [26, 30], [26, 31], [26, 32],
    ],
  });

  // Call viewer.destroy() when removing the viewer.
</script>
```

The viewer includes controls to start, pause, advance one generation, reset, and clear the board. Click cells to edit them. The canvas adapts to its container’s width, and styles are scoped to `.life-viewer`.

`cells` contains zero-based `[row, column]` coordinates; `interval` is the time between generations in milliseconds. Available rules are `Conway`, `HighLife`, and `Seeds`. Each viewer owns its universe. Call `viewer.destroy()` when removing it from the page to release its resources.

This is the repository’s minimal viewer; the demo’s pattern selectors and this website’s component are additional layers over the same API.

## Try it locally

From the directory containing your HTML and `life/`, run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Use HTTP rather than opening the HTML with `file://`, so the browser can load the module and WASM.

## Use the engine directly

To draw your own viewer, use the API without `viewer.js`:

```javascript
import init, { Universe, LifeRule } from "/life/pkg/lifelike_wasm.js";

await init();
const universe = new Universe(64, 48, LifeRule.Conway);
universe.setCell(2, 3, true);
universe.tick();
const alive = universe.getCell(2, 3);
universe.free();
```

`width()` and `height()` return the dimensions; `clear()` empties the board, and `cells()` returns a copy of the cells packed into bytes. The universe is finite with no wrapping: positions outside its boundaries are treated as dead.

To compile the WASM from Rust or explore the API, see the [Lifelike repository](https://github.com/aleph8/lifelike) and its [example guide](https://github.com/aleph8/lifelike/blob/main/examples/README.md).
