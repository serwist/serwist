---
"@serwist/build": patch
---

fix(serwist/build): removed fsevents

- Seems that it only supports Darwin, which means that other OSes' users are not be able to install the package (not sure why this doesn't happen to most people, including me). Not that we actually use it anyway.
