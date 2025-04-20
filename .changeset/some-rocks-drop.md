---
"@serwist/react-router": patch
---

fix(react-router/preview): removed faulty React components

- Turns out we can't just import virtual modules in our own modules as they get externalized for React Router's SSR build... It worked on my machine though, as React Router seems to bundle local packages as well.