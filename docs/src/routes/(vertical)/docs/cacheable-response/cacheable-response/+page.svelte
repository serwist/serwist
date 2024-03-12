<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="cacheable-response">CacheableResponse</h1>
<br /><br />
<h2 id="first-added">First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2 id="about">About</h2>
<br />
<p>
  Allows you to set up rules determining what status codes and/or headers need to be present in order for a
  <ICD><a class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/Response" target="_blank" rel="noreferrer">Response</a></ICD>
  to be considered cacheable.
</p>
<br /><br />
<h2 id="options">Options</h2>
<br />
<ul class="list">
  <li>
    <ICD>statuses</ICD> — One or more status codes that a <ICD>Response</ICD> can have to be considered cacheable.
  </li>
  <li>
    <ICD>headers</ICD> — A mapping of header names and expected values that a <ICD>Response</ICD> can have and be considered cacheable. If multiple headers
    are provided, only one needs to be present.
  </li>
</ul>
<br /><br />
<h2 id="methods-and-fields">Methods and fields</h2>
<br />
<ul class="list">
  <li>
    <ICD>isResponseCacheable(response)</ICD> — Checks a response to see whether it's cacheable or not.
  </li>
</ul>
<br /><br />
<h2 id="usage">Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
