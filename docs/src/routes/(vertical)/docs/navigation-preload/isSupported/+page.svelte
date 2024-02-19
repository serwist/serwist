<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  const { data } = $props();
</script>

<h1 id="is-supported">isSupported</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>Checks whether the current browser supports navigation preloading.</p>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
