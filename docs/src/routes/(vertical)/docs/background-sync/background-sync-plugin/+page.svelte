<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="background-sync-plugin">BackgroundSyncPlugin</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>
  A class implementing the <ICD>fetchDidFail</ICD> lifecycle callback. This makes it easier to add failed requests to a background sync
  <ICD><a class="link" href="./queue">Queue</a></ICD>.
</p>
<br /><br />
<h2 id="parameters">Parameters</h2>
<br />
<p>
  See
  <a class="link" href="./queue#parameters"><ICD>Queue</ICD>'s parameters</a>.
</p>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
