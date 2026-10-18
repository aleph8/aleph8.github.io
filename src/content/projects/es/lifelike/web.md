---
title: "Usar Lifelike en una web"
sidebar_label: "Integración web"
description: "Cómo embeber un visor de Lifelike con HTML, JavaScript y WebAssembly."
order: 2
translationKey: lifelike-web
---

Lifelike se puede usar en una web estática, sin dependencias ni bundler. El motor se ejecuta en **WebAssembly** y el visor utiliza HTML, CSS y JavaScript.

## Preparar los archivos

1. Descarga el paquete compilado de la [release v0.1.0](https://github.com/aleph8/lifelike/releases/tag/v0.1.0) y extrae sus archivos en `life/pkg/`. No necesitas instalar Rust.
2. Copia `viewer.js` y `viewer.css` de la [carpeta examples del repositorio](https://github.com/aleph8/lifelike/tree/main/examples) en `life/`.
3. Sirve esa carpeta como archivos estáticos de tu web, conservando juntos el JavaScript generado y el binario WASM:

```text
life/
  viewer.js
  viewer.css
  pkg/
    lifelike_wasm.js
    lifelike_wasm_bg.wasm
```

El paquete también incluye declaraciones de TypeScript, metadatos y licencia. Conserva la licencia al distribuirlo.

## Añadir el visor

Incluye este fragmento en tu página. Carga el **replicator de HighLife**, inicialmente pausado:

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

El visor incluye controles para iniciar, pausar, avanzar una generación, reiniciar y vaciar el tablero. Puedes hacer clic en las celdas para editarlas. Su tamaño se adapta al ancho del contenedor y los estilos están limitados a `.life-viewer`.

`cells` contiene coordenadas `[fila, columna]` empezando en cero; `interval` es el tiempo entre generaciones en milisegundos. Las reglas disponibles son `Conway`, `HighLife` y `Seeds`. Cada visor mantiene su propio universo. Si lo retiras de la página, llama a `viewer.destroy()` para liberar sus recursos.

Este es el visor mínimo del repositorio; los selectores de patrones de la demo y el componente de esta web son capas adicionales sobre la misma API.

## Probar en local

Desde la carpeta que contiene tu HTML y `life/`, ejecuta:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`. Usa HTTP en lugar de abrir el HTML con `file://`, para que el navegador pueda cargar el módulo y el WASM.

## Usar el motor directamente

Si prefieres dibujar tu propio visor, puedes usar la API sin `viewer.js`:

```javascript
import init, { Universe, LifeRule } from "/life/pkg/lifelike_wasm.js";

await init();
const universe = new Universe(64, 48, LifeRule.Conway);
universe.setCell(2, 3, true);
universe.tick();
const alive = universe.getCell(2, 3);
universe.free();
```

`width()` y `height()` devuelven las dimensiones; `clear()` vacía el tablero y `cells()` devuelve una copia de las celdas empaquetadas en bytes. El universo es finito y no conecta los bordes: las posiciones exteriores se consideran muertas.

Para compilar el WASM desde Rust o consultar el resto de la API, visita el [repositorio de Lifelike](https://github.com/aleph8/lifelike) y su [guía del ejemplo](https://github.com/aleph8/lifelike/blob/main/examples/README.md).
