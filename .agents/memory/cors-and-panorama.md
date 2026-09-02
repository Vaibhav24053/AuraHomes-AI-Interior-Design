---
name: Canvas image sources
description: CORS behavior to account for when an AuraHomes image is used inside an interactive canvas or WebGL surface.
---

Use a local or explicitly CORS-enabled source for any image that must be sampled by a canvas or WebGL texture. Search-based image redirects can render as ordinary `<img>` elements while still failing CORS when passed to `TextureLoader` or drawn into a canvas. For demo panorama states, a locally generated 2:1 canvas texture is a reliable fallback.

**Why:** The browser preview environment allowed the search result to render in the page but rejected it when the AR viewer tried to use it as a GPU/canvas texture.

**How to apply:** Keep ordinary editorial images separate from interactive texture inputs, and always handle WebGL creation and texture loading failure without taking down the result page.