<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>reloadOnOnline</h1>
<h2>First added</h2>
<Code>next-pwa</Code>
<h2>Default</h2>
<Code>true</Code>
<h2>About</h2>
<p>Whether Serwist should reload the app when it goes online.</p>
<h2>How it works</h2>
<p>
  When this is set to <InlineCode>true</InlineCode>, the code injected into your app's entrypoints adds an event listener that runs
  <InlineCode>location.reload()</InlineCode> to window's "online" event.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
