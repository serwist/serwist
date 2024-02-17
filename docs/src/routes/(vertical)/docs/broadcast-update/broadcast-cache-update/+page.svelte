<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="broadcast-cache-update">BroadcastCacheUpdate</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>
  A class that uses the <ICD>postMessage()</ICD> API to inform any open windows/tabs
  when a cached response has been updated.
</p>
<br />
<p>
  For efficiency's sake, the underlying response bodies are not compared; only
  specific response headers are checked.
</p>
<br /><br />
<h2 id="options">Options</h2>
<br />
<ul class="list">
  <li>
    <ICD>headersToCheck</ICD> — A list of headers that will be used to determine
    whether the responses differ.
  </li>
  <li>
    <ICD>generatePayload(options)</ICD> — A function whose return value will be used
    as the <ICD>payload</ICD> field in any cache update messages sent to the window
    clients.
  </li>
  <li>
    <ICD>notifyAllClients</ICD> If <ICD>true</ICD> (the default) then all open clients
    will receive a message. If <ICD>false</ICD>, then only the client that make
    the original request will be notified of the update.
  </li>
</ul>
<br /><br />
<h2 id="methods-and-fields">Methods and fields</h2>
<br />
<ul class="list">
  <li>
    <ICD>async notifyIfUpdated(options)</ICD> — Compares two responses and sends
    a message (via <ICD>postMessage()</ICD>) to all window clients if the
    responses differ. Neither of the responses can be opaque.
  </li>
</ul>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
