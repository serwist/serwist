---
"@serwist/vite": major
---

refactor(vite): moved getSerwist from `@serwist/vite/browser` to `virtual:serwist`

- `@serwist/vite/browser.getSerwist` required `@serwist/vite` to provide it build time information through virtual modules. However, this seems to cause bugs in development mode, and it is not a great pattern to use. As such, we are moving `getSerwist` from `@serwist/vite/browser` to `virtual:serwist`.

- To migrate, simply update the import.

    - Old:

    ```ts
    import { getSerwist } from "@serwist/vite/browser";
    ```

    - New:
    
    ```ts
    import { getSerwist } from "virtual:serwist";
    ```

- If you use TypeScript, you may also want to add `@serwist/vite/typings` to `compilerOptions.types` so Serwist can properly type the virtual module for you.