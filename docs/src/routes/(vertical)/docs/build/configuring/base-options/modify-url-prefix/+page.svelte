<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>modifyURLPrefix</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2>About</h2>
<br />
<p>
  An object mapping string prefixes to replacement string values. This can be used to, e.g., remove or add a path prefix from a manifest entry if your
  web hosting setup doesn't match your local filesystem setup. As an alternative with more flexibility, you can use the
  <InlineCode><a class="link" href="./manifest-transforms">manifestTransforms</a></InlineCode>
  option and provide a function that modifies the entries in the manifest using whatever logic you provide.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.js" />
