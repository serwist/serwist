<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1>disable</h1>
<h2>First added</h2>
<Code>next-pwa</Code>
<h2>Default</h2>
<Code>false</Code>
<h2>About</h2>
<p>Whether Serwist should be disabled.</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
