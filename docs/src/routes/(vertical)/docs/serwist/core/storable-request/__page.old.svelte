<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="storable-request">StorableRequest</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>A class to make it easier to serialize and de-serialize requests so they can be stored in IndexedDB.</p>
<p>Most developers will not need to access this class directly; it is exposed for advanced use cases.</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>requestData</ICD> — An object of request data that includes the <ICD>url</ICD> plus any relevant property of
    <ExternalLink class="link" href="https://fetch.spec.whatwg.org/#requestinit"><ICD>requestInit</ICD></ExternalLink>.
  </li>
</ul>
<h2 id="methods-and-fields">Methods and fields</h2>
<ul class="list">
  <li>
    <ICD>static async fromRequest(request)</ICD> — Converts a <ICD>Request</ICD> object to a plain object that can be structured cloned or stringified
    to JSON.
  </li>
  <li><ICD>toObject()</ICD> — Returns a deep clone of the instance's <ICD>requestData</ICD> object.</li>
  <li><ICD>toRequest()</ICD> — Converts this instance to a Request.</li>
  <li><ICD>clone()</ICD> — Creates and returns a deep clone of the instance.</li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
