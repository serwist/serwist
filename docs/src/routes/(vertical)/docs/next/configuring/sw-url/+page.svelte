<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<Heading type="display">swUrl</Heading>
<br /><br />
<Heading type="title-large">First added</Heading>
<br />
<Code>next-pwa</Code>
<br /><br />
<Heading type="title-large">About</Heading>
<br />
<Text>The URL to the service worker.</Text>
<br /><br />
<Heading type="title-large">Why?</Heading>
<br />
<Text>
  Serwist, by providing the option <InlineCode>swDest</InlineCode>, made itself unable to determine the URL to the service worker. As a result, it
  assumes that this URL is "/sw.js". However, sometimes you might want something else, providing purpose for this option.
</Text>
<br /><br />
<Heading type="title-large">Usage</Heading>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
