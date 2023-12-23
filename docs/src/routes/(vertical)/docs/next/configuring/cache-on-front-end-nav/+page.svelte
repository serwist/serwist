<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<Heading type="display">cacheOnFrontEndNav</Heading>
<br /><br />
<Heading type="title-large">First added</Heading>
<br />
<Code>next-pwa@5.2.1</Code>
<br /><br />
<Heading type="title-large">Default</Heading>
<br />
<Code>false</Code>
<br /><br />
<Heading type="title-large">About</Heading>
<br />
<Text>
  Enable additional route caching when users navigate through pages with
  <InlineCode>next/link</InlineCode>. This improves the user experience in some cases but it also adds a bit of overhead due to additional network
  calls.
</Text>
<br /><br />
<Heading type="title-large">How it works</Heading>
<br />
<Text>
  It overrides <InlineCode>history.pushState</InlineCode> and <InlineCode>history.pushState</InlineCode>. When these functions are called, they call a
  function that posts a message containing the URL in their parameters to the <InlineCode>@serwist/next</InlineCode> worker, telling it to add this URL
  to the cache.
</Text>
<br /><br />
<Heading type="title-large">Usage</Heading>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
