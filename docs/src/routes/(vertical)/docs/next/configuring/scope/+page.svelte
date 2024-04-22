<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>scope</h1>
<h2>First added</h2>
<Code>next-pwa</Code>
<h2>Default</h2>
<Code>nextConfig.basePath</Code>
<h2>About</h2>
<p>
  The service worker's URL scope. Set to <ICD>"/foo/"</ICD> so that paths under "/foo/" are under the service worker's control while others are not.
</p>
<Callout type="warning">Note: "/foo" does NOT belong to the aforementioned scope! Consider configuring how Next.js handles trailing slashes.</Callout>
<h2>Usage</h2>
<Callout type="warning">
  Note: this option is not influenced by your basePath! If you don't have a trailing slash, the slash is automatically appended to the scope.
  Otherwise, it is passed to Serwist as-is.
</Callout>
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
