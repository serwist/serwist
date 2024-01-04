<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>cacheOnFrontEndNav</h1>
<br /><br />
<h2>First added</h2>
<br />
<Code>next-pwa@5.2.1</Code>
<br /><br />
<h2>Default</h2>
<br />
<Code>false</Code>
<br /><br />
<h2>About</h2>
<br />
<p>
  Enable additional route caching when users navigate through pages with
  <InlineCode>next/link</InlineCode>. This improves the user experience in some cases but it also adds a bit of overhead due to additional network
  calls.
</p>
<br /><br />
<h2>How it works</h2>
<br />
<p>
  It overrides <InlineCode>history.pushState</InlineCode> and <InlineCode>history.pushState</InlineCode>. When these functions are called, they call a
  function that posts a message containing the URL in their parameters to the <InlineCode>@serwist/next</InlineCode> worker, telling it to add this URL
  to the cache.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
