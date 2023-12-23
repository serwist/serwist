<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<Heading type="display">scope</Heading>
<br /><br />
<Heading type="title-large">First added</Heading>
<br />
<Code>next-pwa</Code>
<br /><br />
<Heading type="title-large">Default</Heading>
<br />
<Code>nextConfig.basePath</Code>
<br /><br />
<Heading type="title-large">About</Heading>
<br />
<Text>The service worker's URL scope. Set to "/foo/" so that paths under "/foo/" are under the service worker's control while others are not.</Text>
<br />
<Callout type="warning">Note: "/foo" does NOT belong to the aforementioned scope! Consider configuring how Next.js handles trailing slashes.</Callout>
<br /><br />
<Heading type="title-large">Usage</Heading>
<br />
<Callout type="warning">
  Note: this option is not influenced by your basePath! If you don't have a trailing slash, the slash is automatically appended to the scope.
  Otherwise, it is passed to Serwist as-is.
</Callout>
<br />
<CodeTab codes={data.code.usage} defaultTab="next.config.mjs" />
