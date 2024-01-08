<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>templatedURLs</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2>About</h2>
<br />
<p>
  If a URL is rendered based on some server-side logic, its contents may depend on multiple files or on some other unique string value. The keys in
  this object are server-rendered URLs. If the values are an array of strings, they will be interpreted as <InlineCode>glob</InlineCode> patterns, and
  the contents of any files matching the patterns will be used to uniquely version the URL. If used with a single string, it will be interpreted as unique
  versioning information that you've generated for a given URL.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.js" />
