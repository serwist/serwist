<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="scope">scope</h1>
<h2 id="first-added">First added</h2>
<p>8.2.0</p>
<h2 id="default">Default</h2>
<Code>viteOptions.base</Code>
<h2 id="about">About</h2>
<p>
  The service worker's URL scope. Set to <ICD>"/foo/"</ICD> so that paths under "/foo/" are under the service worker's control while others are not.
</p>
<Callout type="warning">Note: "/foo" does NOT belong to the aforementioned scope! Consider configuring how trailing slashes are handled.</Callout>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="vite.config.ts" />
