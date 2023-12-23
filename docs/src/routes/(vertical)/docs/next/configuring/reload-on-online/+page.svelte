<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<Heading type="display">reloadOnOnline</Heading>
<br /><br />
<Heading type="title-large">First added</Heading>
<br />
<Code>next-pwa</Code>
<br /><br />
<Heading type="title-large">Default</Heading>
<br />
<Code>true</Code>
<br /><br />
<Heading type="title-large">About</Heading>
<br />
<Text>Whether Serwist should reload the app when it goes online.</Text>
<br /><br />
<Heading type="title-large">How it works</Heading>
<br />
<Text>
  When this is set to <InlineCode>true</InlineCode>, the code injected into your app's entrypoints adds an event listener that runs
  <InlineCode>location.reload()</InlineCode> to window's "online" event.
</Text>
<br /><br />
<Heading type="title-large">Usage</Heading>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
