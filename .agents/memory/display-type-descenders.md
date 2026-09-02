---
name: Display-type descenders
description: Preventing large serif headline descenders from being clipped by surrounding layout.
---

Large display-serif headlines must retain visible vertical overflow through their ancestor layout, not merely use a larger line-height.

**Why:** Adjusting line-height alone did not restore the lower strokes of letters such as “g” and “y” while a page-level container still clipped vertical overflow.

**How to apply:** When a large headline loses descenders, inspect ancestor overflow first. Constrain only horizontal overflow where needed, and leave explicit descent space on the headline.