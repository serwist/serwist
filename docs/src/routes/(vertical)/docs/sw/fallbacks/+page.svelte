<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>fallbacks</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>8.0.0</p>
<br /><br />
<h2>About</h2>
<br />
<p>Precaches routes so that they can be used as a fallback when a Strategy fails to generate a response.</p>
<br /><br />
<h2>How it works</h2>
<br />
<p>
  It precaches the provided routes and modifies the provided
  <InlineCode>RuntimeCaching</InlineCode> array so that when a handler fails to handle a <InlineCode>Request</InlineCode>, the first matching fallback
  entry is used as a <InlineCode>Response</InlineCode>.
</p>
<br /><br />
<h2>Options</h2>
<br />
<ul class="list">
  <li>
    <InlineCode>runtimeCaching</InlineCode> — Your previous
    <InlineCode>RuntimeCaching</InlineCode> list.
  </li>
  <li><InlineCode>entries</InlineCode> — A list of fallback entries.</li>
  <li>
    <InlineCode>precacheOptions</InlineCode> — Precache options that will be used for your fallback entries.
  </li>
</ul>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
