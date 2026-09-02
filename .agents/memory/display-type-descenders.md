---
name: Display-type descenders
description: Preventing large serif headline descenders from being clipped by surrounding layout.
---

When individual glyphs in a gradient-filled display headline need isolated descent space, nested spans must receive their own gradient-text fill as well as a taller inline box.

**Why:** Adjusting the parent line-height and overflow did not change the affected “g” and “y.” Isolating them revealed that `background-clip: text` on the parent did not paint the nested glyph spans.

**How to apply:** Give isolated descender spans an explicit inline line box and apply the gradient-text treatment directly to each nested span. Keep vertical overflow visible through the headline hierarchy.