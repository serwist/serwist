# Adding documentation

- The development branch is `main`.
- All pull requests should be opened against `main`.

## Developing locally:

1. Clone the Serwist repository:
   ```bash
   git clone https://github.com/serwist/serwist -- --depth=3000 --branch main --single-branch
   ```
1. Create a new branch:
   ```bash
   git checkout -b MY_BRANCH_NAME origin/main
   ```
1. Install the dependencies with:
   ```bash
   pnpm install
   ```
1. `cd` into `docs`:
   ```bash
   cd docs
   ```
1. Start developing:

   ```bash
   pnpm dev
   ```

   And then edit the content in `docs/src/routes`. The app should automatically reflect the changes!

1. When your changes are finished, commit them to the branch:
   ```
   git add .
   git commit -m "DESCRIBE_YOUR_CHANGES_HERE"
   ```
1. When you are ready to push, make a fork and then run:
   ```
   git remote set-url origin https://github.com/YOURNAME/serwist
   git push
   ```

## Why not Markdown?

- Although Markdown itself is a great technology, one found it to be... rather difficult to setup and maintain, especially with SvelteKit. The documentation site of `@ducanh2912/next-pwa` serves as a painful example of having to jump through hoops so as to use this technology (certain dependencies... simply can't be updated, and the code behind the docs was rather... an eyesore). As such, we use Svelte itself to write the documentation. Although doing so involves more manual work, it is easier to read and maintain, less hacky, more foolproof, and more customizable.

## Conventions

- See [Conventions](./conventions.md).

## Adding a table of contents

- To add a table of contents, go to `+page.server.ts` and add `toc` to the returned data in `load`. It should be an array of `TocEntry`, which consists of `title` (which should reflects the actual heading in the content), `id` (which is the `id` of the heading), and `children` (the `TocEntry`'s of the children of this heading - basically any heading one level down that is placed before another heading with the same level as this one).

## Adding highlighted code

- To add some highlighted code, go to `+page.server.ts` and add `code` to the returned data in `load`. To highlight some code, use `shiki.getHighlighter` along with `$lib/highlightCode.highlightCode`:

```ts
import { highlightCode } from "$lib/highlightCode";
import type { TocEntry } from "$lib/types";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => ({
  title: "Foo",
  code: {
    basicUsage: {
      setup: highlightCode(
        locals.highlighter,
        {
          "sw.ts": {
            code: `import { enable as enableNavigationPreload } from "@serwist/navigation-preload";
import { NetworkFirst } from "@serwist/strategies";
import { registerRoute, NavigationRoute } from "@serwist/routing";

enableNavigationPreload();

// Swap in NetworkOnly, CacheFirst, or StaleWhileRevalidate as needed.
const navigationStrategy = new NetworkFirst({
  cacheName: "cached-navigations",
});

const navigationRoute = new NavigationRoute(navigationStrategy, {
  // Optionally, provide a allow/denylist of RegExps to determine
  // which paths will match this route.
  // allowlist: [],
  // denylist: [],
});

registerRoute(navigationRoute);`,
            lang: "typescript",
          },
        },
        { idPrefix: "basic-usage" }
      ),
    },
  },
});
```

- To access this code in the Svelte markup, do this:

```svelte
<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<CodeTab codes={data.code.basicUsage.setup} defaultTab="sw.ts" />
```

`$lib/highlightCode.highlightCode` creates data that is specifically meant for `<CodeTab />`. You should feed the data to that component, rather than use it directly.

## Adding a page to the sidebar

- Simply edit `SIDEBAR_LINKS`, located at docs/src/routes/(vertical)/docs/constants.ts.

## Adding a static asset

- We manually maintain `staticRevisions` in docs/src/service-worker.ts so as to avoid having the users recache these assets, which are unlikely to change, too often. Please remember to bump it whenever you change an asset!
