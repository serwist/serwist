<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<h1>manifestTransforms</h1>
<br /><br />
<h2>First added</h2>
<br />
<p>Workbox</p>
<br /><br />
<h2>About</h2>
<br />
<p>
  One or more functions which will be applied sequentially against the generated manifest. If
  <InlineCode><a class="link" href="./modify-url-prefix">modifyURLPrefix</a></InlineCode> or
  <InlineCode><a class="link" href="./dont-cache-bust-urls-matching">dontCacheBustURLsMatching</a></InlineCode>
  are also specified, their corresponding transformations will be applied first.
</p>
<br /><br />
<h2>Usage</h2>
<br />
<CodeTab codes={data.code.usage} defaultTab="build.ts" />
