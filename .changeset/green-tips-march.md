---
"@serwist/next": patch
---

fix(next): fixed `__dirname` conflict in CommonJS

- Thanks @jthcast! Their message:

> If you use `storybook` and `serwist` together, they will conflict for `__dirname` variable. Because it is already created with a global scope, it cannot be used by branching from the business logic it uses. So I suggest moving to scope within the function.
