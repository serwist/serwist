<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="queue">Queue</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>
  A class to manage storing failed requests in IndexedDB and retrying them later. All parts of the storing and replaying process are observable via
  callbacks.
</p>
<br /><br />
<h2 id="parameters">Parameters</h2>
<br />
<ul class="list">
  <li>
    <ICD>name</ICD> — The unique name for this queue. This name must be unique as it's used to register sync events and store requests in IndexedDB specific
    to this instance. An error will be thrown if a duplicate name is detected.
  </li>
  <li>
    <ICD>options</ICD> — Configuration for the Queue.
    <ul class="list">
      <li>
        <ICD>forceSyncFallback</ICD> — If <ICD>true</ICD>, instead of attempting to use background sync events, always attempt to replay queued
        request at service worker startup. Most folks will not need this, unless you explicitly target a runtime like Electron that exposes the
        interfaces for background sync, but does not have a working implementation.
      </li>
      <li>
        <ICD>maxRetentionTime</ICD> — The amount of time (in minutes) a request may be retried. After this amount of time has passed, the request will
        be deleted from the queue.
      </li>
      <li>
        <ICD>onSync</ICD> — A function that gets invoked whenever the
        <ICD>sync</ICD> event fires. The function is invoked with an object containing the <ICD>queue</ICD> property (referencing this instance), and you
        can use the callback to customize the replay behavior of the queue. When not set the <ICD>replayRequests()</ICD> method is called. Note: if the
        replay fails after a <ICD>sync</ICD> event, make sure you throw an error, so the browser knows to retry the sync event later.
      </li>
    </ul>
  </li>
</ul>
<br /><br />
<h2 id="methods-and-fields">Methods and fields</h2>
<br />
<ul class="list">
  <li>
    <ICD>get name()</ICD> — The unique name for this queue.
  </li>
  <li>
    <ICD>async pushRequest(entry)</ICD> — Stores the passed request in IndexedDB (with its timestamp and any metadata) at the end of the queue.
  </li>
  <li>
    <ICD>async unshiftRequest(entry)</ICD> — Stores the passed request in IndexedDB (with its timestamp and any metadata) at the beginning of the queue.
  </li>
  <li>
    <ICD>async popRequest()</ICD> — Removes and returns the last request in the queue (along with its timestamp and any metadata).
  </li>
  <li>
    <ICD>async shiftRequest()</ICD> — Removes and returns the first request in the queue (along with its timestamp and any metadata).
  </li>
  <li>
    <ICD>async getAll()</ICD> — Returns all the entries that have not expired (per
    <ICD>maxRetentionTime</ICD>). Any expired entries are removed from the queue.
  </li>
  <li>
    <ICD>async size()</ICD> — Returns the number of entries present in the queue. Note that expired entries (per `maxRetentionTime`) are also included
    in this count.
  </li>
  <li>
    <ICD>async replayRequests()</ICD> — Loops through each request in the queue and attempts to re-fetch it. If any request fails to re-fetch, it's put
    back in the same position in the queue (which registers a retry for the next sync event).
  </li>
  <li>
    <ICD>async registerSync()</ICD> — Registers a sync event with a tag unique to this instance.
  </li>
</ul>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
