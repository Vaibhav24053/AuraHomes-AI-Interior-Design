---
name: Motion ownership
description: Preventing animation layers from overriding each other during AuraHomes interaction work.
---

Give each animated property on an element one owner. When a continuous decorative float needs both CSS and Framer Motion, animate transform on a nested CSS layer and animate glow or filter on the outer Framer wrapper. For keyed image transitions, do not combine Framer inline opacity/transform values with a CSS keyframe targeting those same properties.

**Why:** Browser checks showed state and image source changes working while the intended cross-fade remained visually static because two animation systems wrote the same properties.

**How to apply:** Separate animation responsibilities across nested elements, or choose one animation system for the whole transition. Add stable test selectors to the exact moving layer.