<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>dontCacheBustURLsMatching</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2>About</h2>
<br />
<p>
  Assets that match this will be assumed to be uniquely versioned via their URL, and exempted from the normal HTTP cache-busting that's done when
  populating the precache. While not required, it's recommended that if your existing build process already inserts a <InlineCode>[hash]</InlineCode> value
  into each filename, you provide a RegExp that will detect that, as it will reduce the bandwidth consumed when precaching.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.ts" />
<br /><br />
<h2>Note about webpack</h2>
<br />
<p>
  For most cases, you do not need this option because <InlineCode>@serwist/webpack-plugin</InlineCode> does check whether an asset is immutable for you.
</p>
