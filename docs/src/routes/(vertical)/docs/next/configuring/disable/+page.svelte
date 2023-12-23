<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<Heading type="display">disable</Heading>
<br /><br />
<Heading type="title-large">First added</Heading>
<br />
<Code>next-pwa</Code>
<br /><br />
<Heading type="title-large">Default</Heading>
<br />
<Code>false</Code>
<br /><br />
<Heading type="title-large">About</Heading>
<br />
<Text>Whether Serwist should be disabled.</Text>
<br /><br />
<Heading type="title-large">Usage</Heading>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
