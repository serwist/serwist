<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>registerRuntimeCaching</h1>
<h2>First added</h2>
<p>8.0.0</p>
<h2>About</h2>
<p>
  Registers caching strategies to a singleton Router instance. It is a simple syntatic sugar for
  <InlineCode>@serwist/sw/routing.registerRoute</InlineCode>.
</p>
<h2>Parameters</h2>
<ul class="list">
  <li>
    <InlineCode>...runtimeCachingList</InlineCode> — A list of
    <InlineCode>RuntimeCaching</InlineCode> entries.
  </li>
</ul>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
