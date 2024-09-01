<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>dontCacheBustURLsMatching</h1>
<h2>First added</h2>
<p>Workbox</p>
<h2>About</h2>
<p>
  Assets that match this will be assumed to be uniquely versioned via their URL, and exempted from the normal HTTP cache-busting that's done when
  populating the precache. While not required, it's recommended that if your existing build process already inserts a <InlineCode>[hash]</InlineCode> value
  into each filename, you provide a RegExp that will detect that, as it will reduce the bandwidth consumed when precaching.
</p>
<h2>Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="build.js" />
<h2>Note about webpack</h2>
<p>
  For most cases, you do not need this option because <InlineCode>@serwist/webpack-plugin</InlineCode> does check whether an asset is immutable for you.
</p>
