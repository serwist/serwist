<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="sw-url">swUrl</h1>
<h2 id="first-added">First added</h2>
<Code>next-pwa</Code>
<h2 id="about">About</h2>
<p>The URL to the service worker.</p>
<h2 id="why">Why?</h2>
<p>
  Serwist, by providing the option <InlineCode>swDest</InlineCode>, made itself unable to determine the URL to the service worker. As a result, it
  assumes that this URL is "/sw.js". However, sometimes you might want something else, providing purpose for this option.
</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
