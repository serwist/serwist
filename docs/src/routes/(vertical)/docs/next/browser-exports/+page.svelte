<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<Heading type="display">Browser exports</Heading>
<br /><br />
<Heading type="title-large">Why?</Heading>
<br />
<Text>
  <InlineCode>@serwist/next</InlineCode> exports a few things for the service worker to consume. These values cannot be exported with things that use Node.js-specific
  APIs, hence <InlineCode>@serwist/next/browser</InlineCode> was created.
</Text>
<br /><br />
<Heading type="title-large">Exported values</Heading>
<br />
<ul>
  <li>
    <Heading type="title"><InlineCode>defaultCache</InlineCode></Heading>
    <br />
    <Text>Type: <InlineCode>RuntimeCaching[]</InlineCode></Text>
    <br />
    <Text>What: the default, recommended <InlineCode>runtimeCaching</InlineCode> array of <InlineCode>@serwist/next</InlineCode>.</Text>
    <br />
    <Text>How to use:</Text>
    <br />
    <CodeTab codes={data.code.defaultCache.usage} defaultTab="app/sw.ts" />
    <br />
    <Callout type="info">
      Note: you may extend the array. It is recommended that you define your entries above the defaultCache array so that they are prioritized. You
      may even filter out the default entries that share cache names with those of yours to be sure.
    </Callout>
  </li>
</ul>
