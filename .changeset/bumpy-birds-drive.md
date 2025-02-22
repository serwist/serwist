---
"@serwist/next": patch
---

fix(next): filter out all JSON files in the compilation directory

- With this change, even if Next.js introduces new manifest files, Serwist won't just straight up break.