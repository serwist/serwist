# Conventions

## Names

- When you write names such as TypeScript, JavaScript, Node.js, Next.js, etc., do it correctly. No Typescript, Javascript, Node, NodeJS, Next, or NextJS.

## Grammar

- Attempt to make as few grammar errors as possible. Thank you. A distinct lack of grammar errors... simply delivers a sense of professionalism I struggle to find anywhere else. Consider this my selfish request.

## Code

- Code blocks should be sent from the server through +page.server.ts or +layout.server.ts. Although this causes SvelteKit to inline a fairly large amount of data into the produced HTML, it is still generally acceptable, more readable, and it saves the client from a bit of extra work that is highlighting code.

```ts
import { highlightCode } from "$lib/highlightCode";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  return {
    code: {
      install: highlightCode(
        locals.highlighter,
        {
          npm: {
            code: "npm i @serwist/next",
            lang: "bash",
          },
          yarn: {
            code: "yarn add @serwist/next",
            lang: "bash",
          },
          pnpm: {
            code: "pnpm add @serwist/next",
            lang: "bash",
          },
          bun: {
            code: "bun add @serwist/next",
            lang: "bash",
          },
        },
        { idPrefix: "install-serwist-next-instruction" }
      ),
    },
  };
};
```

`highlightCode` creates data that is specifically meant for `<CodeTab />`. You should feed the data to that component, rather than use it directly.

```svelte
<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<CodeTab codes={data.code.install} defaultTab="npm" />
```

## Sections

- A docs page should be divided into sections. Sections are separated with a `<br /><br />`. Parts of a section are separated with a `<br />`.

```svelte
<script>
  import InlineCode from "$components/InlineCode.svelte";
</script>

<h1>Welcome to Serwist!</h1>
<br /><br />
<h2>Introduction</h2>
<br />
<p>
  Serwist is the Swiss Army knife for service workers.
</p>
<br /><br />
<h2>Getting started</h2>
<br />
<p>
  See <a class="link" href="/docs/getting-started">Getting started</a>.
</p>
```

## Styling

- Links (`<a />`) and lists (`<ul />`) should use the `".link"` and `".list"` utility classes respectively.
