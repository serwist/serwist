<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>scope</h1>
<br /><br />
<h2>First added</h2>
<br />
<Code>next-pwa</Code>
<br /><br />
<h2>Default</h2>
<br />
<Code>nextConfig.basePath</Code>
<br /><br />
<h2>About</h2>
<br />
<p>The service worker's URL scope. Set to "/foo/" so that paths under "/foo/" are under the service worker's control while others are not.</p>
<br />
<Callout type="warning">Note: "/foo" does NOT belong to the aforementioned scope! Consider configuring how Next.js handles trailing slashes.</Callout>
<br /><br />
<h2>Usage</h2>
<br />
<Callout type="warning">
  Note: this option is not influenced by your basePath! If you don't have a trailing slash, the slash is automatically appended to the scope.
  Otherwise, it is passed to Serwist as-is.
</Callout>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
