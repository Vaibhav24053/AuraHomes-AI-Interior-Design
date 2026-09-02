---
name: GPT Image edit inputs
description: Provider-specific request constraints for AuraHomes room-photo editing.
---

For GPT Image edit requests, use the uploaded room as the `images.edit` input, rely on the default base64 response, and limit inputs to JPEG, PNG, or WebP with a matching filename extension. Do not send DALL-E-only response-format options or accept GIF for this route.

**Why:** The SDK type surface can expose parameters that are not accepted uniformly by every image model, and GPT Image input support is narrower than Claude vision input support.

**How to apply:** Keep MIME validation provider-specific. Claude room detection may accept GIF, but the OpenAI redesign route must reject it before the provider call.