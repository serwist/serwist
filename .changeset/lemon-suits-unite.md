---
"serwist": patch
---

fix(log): log incorrect URLs outside of loop

- This PR fixes invalid precache entries being logged inside a loop that is used to traverse through the precache entries, causing them to be logged multiple times.