<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>modifyURLPrefix</h1>
<h2>First added</h2>
<p>Workbox</p>
<h2>About</h2>
<p>
  An object mapping string prefixes to replacement string values. This can be used to, e.g., remove or add a path prefix from a manifest entry if your
  web hosting setup doesn't match your local filesystem setup. As an alternative with more flexibility, you can use the
  <InlineCode><a class="link" href="./manifest-transforms">manifestTransforms</a></InlineCode>
  option and provide a function that modifies the entries in the manifest using whatever logic you provide.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
