<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="constants">Constants</h1>
<h2 id="exported-values">Exported values</h2>
<p>
  <ICD>@serwist/broadcast-update</ICD> exports a few constants that you can make use of for more convenience. This includes:
</p>
<ul>
  <li>
    <h3 id="cache-updated-message-meta"><ICD>CACHE_UPDATED_MESSAGE_META</ICD></h3>
        <p>
      What: the meta used by <ICD>@serwist/broadcast-update</ICD> for identification.
    </p>
        <p>How to use:</p>
        <CodeTab codes={data.code.cacheUpdatedMessageMeta.usage} defaultTab="sw.ts" />
      </li>
  <li>
    <h3 id="cache-updated-message-type"><ICD>CACHE_UPDATED_MESSAGE_TYPE</ICD></h3>
        <p>
      What: the message type used by <ICD>@serwist/broadcast-update</ICD> for identification.
    </p>
        <p>How to use:</p>
        <CodeTab codes={data.code.cacheUpdatedMessageType.usage} defaultTab="sw.ts" />
      </li>
  <li>
    <h3 id="default-headers-to-check"><ICD>defaultHeadersToCheck</ICD></h3>
        <p>What: the default list of headers to check.</p>
        <p>How to use:</p>
        <CodeTab codes={data.code.defaultHeadersToCheck.usage} defaultTab="sw.ts" />
      </li>
</ul>
