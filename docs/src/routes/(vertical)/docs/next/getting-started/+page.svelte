<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<Heading type="display">Getting started</Heading>
<br /><br />
<Heading type="title-large">Install</Heading>
<br />
<Text>Run the following command:</Text>
<br />
<CodeTab codes={data.code.install} defaultTab="npm" />
<br /><br />
<Heading type="title-large">Basic usage</Heading>
<br />
<Heading type="title">
  Step 1: Wrap your Next.js config with <span class="inline-block"><InlineCode>withSerwist</InlineCode></span>
</Heading>
<br />
<Text>Update or create next.config.js with the following content:</Text>
<br />
<CodeTab codes={data.code.basicUsage.wrapConfig} defaultTab="next.config.mjs" />
<br /><br />
<Heading type="title">
  Step 2: Create {"app/sw.{ts,js}"} with:
</Heading>
<br />
<CodeTab codes={data.code.basicUsage.createEntry} defaultTab="app/sw.ts" />
<br />
<Text>Note: if you follow the above template, you have to install these additional packages:</Text>
<br />
<CodeTab codes={data.code.basicUsage.createEntryAdditionalPackages} defaultTab="npm" />
<br /><br />
<Heading type="title">Step 3: Add a manifest.json file:</Heading>
<br />
<Text>Create a manifest.json file in your public folder:</Text>
<br />
<CodeTab codes={[data.code.basicUsage.manifestJson]} defaultTab="public/manifest.json" />
<br /><br />
<Heading type="title">
  Step 4: Add <InlineCode>{"<meta />"}</InlineCode> and <InlineCode>{"<link />"}</InlineCode> tags to your <InlineCode>{"<head />"}</InlineCode>
</Heading>
<br />
<Text>
  Add the following to your {"app/layout.{tsx,js,jsx}"} or {"pages/_app.{tsx,js,jsx}"}:
</Text>
<br />
<CodeTab codes={data.code.basicUsage.metaAndLinkTags} defaultTab="app/layout.tsx" />
