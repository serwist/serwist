<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  const { data } = $props();
</script>

<h1 id="is-supported">isSupported</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>Checks whether the current browser supports navigation preloading.</p>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
