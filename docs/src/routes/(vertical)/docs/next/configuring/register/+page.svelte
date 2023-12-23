<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import Heading from "$components/Heading.svelte";
  import InlineCode from "$components/InlineCode.svelte";
  import Text from "$components/Text.svelte";

  import type { PageData } from "./$types";

  const { data } = $props<{ data: PageData }>();
</script>

<Heading type="display">register</Heading>
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
<Text>
  Whether <InlineCode>@serwist/next</InlineCode> should automatically register the service worker for you. If you want to register the service worker yourself,
  set this to <InlineCode>false</InlineCode> and run <InlineCode>window.serwist.register()</InlineCode> in <InlineCode>componentDidMount</InlineCode> or
  <InlineCode>useEffect</InlineCode>.
</Text>
<br /><br />
<Heading type="title-large">How it works</Heading>
<br />
<Text>
  When set to <InlineCode>true</InlineCode>, the code injected into your app's entrypoints runs <InlineCode>window.serwist.register()</InlineCode>,
  registering the service worker. This is rerun everytime those entrypoints are loaded.
</Text>
<br /><br />
<Heading type="title-large">Usage</Heading>
<br />
<Text>In your {"next.config.{mjs,js}"}:</Text>
<br />
<CodeTab codes={data.code.usage.config} defaultTab="next.config.mjs" />
<br />
<Text>In your app:</Text>
<br />
<CodeTab codes={data.code.usage.app} defaultTab="app/register-pwa.jsx" />
<br />
<Text>
  Note: if you use TypeScript and follow the above template, do add <InlineCode>@serwist/next/typings</InlineCode> to
  <InlineCode>compilerOptions.types</InlineCode> in your tsconfig.json! This allows <InlineCode>window.serwist</InlineCode> to be automatically typed.
</Text>
