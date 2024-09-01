<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="copy-response">copyResponse</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  Allows developers to copy a response and modify its <ICD>headers</ICD>, <ICD>status</ICD>, or <ICD>statusText</ICD> values (the <ExternalLink
    class="link"
    href="https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#options"
  >
    valid options
  </ExternalLink> when constructing a <ICD>Response</ICD> object).
</p>
<p>
  To modify these values, pass a function as the second argument. That function will be invoked with the options of the initial <ICD>Response</ICD> object.
  The return value of this function will be used as the options for the new <ICD>Response</ICD> object. To change the values either modify the passed parameter(s)
  and return it or return a totally new object.
</p>
<p>This method is intentionally limited to same-origin responses, regardless of whether CORS was used or not.</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>response</ICD> — The initial response.
  </li>
  <li>
    <ICD>modifier(responseInit)</ICD> — The function used to modify the options of the <ICD>Response</ICD> object.
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
