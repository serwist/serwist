<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>swUrl</h1>
<br /><br />
<h2>First added</h2>
<br />
<Code>next-pwa</Code>
<br /><br />
<h2>About</h2>
<br />
<p>The URL to the service worker.</p>
<br /><br />
<h2>Why?</h2>
<br />
<p>
  Serwist, by providing the option <InlineCode>swDest</InlineCode>, made itself unable to determine the URL to the service worker. As a result, it
  assumes that this URL is "/sw.js". However, sometimes you might want something else, providing purpose for this option.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
