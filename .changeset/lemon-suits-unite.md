---
"serwist": patch
---

fix(log): log incorrect URLs outside of loop

- A loop is used to accumulate URLs without revision info. The goal was probably to display the list as a warning once outside of the loop. Unfortunately the current code is displaying the warning inside the loop, meaning you could get the same warning a hundred times for a single URL without revision info. This PR fixes this.