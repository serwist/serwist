<script lang="ts">
  import Code from "$components/Code.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>register</h1>
<h2>First added</h2>
<Code>next-pwa</Code>
<h2>Default</h2>
<Code>true</Code>
<h2>About</h2>
<p>
  Whether <InlineCode>@serwist/next</InlineCode> should automatically register the service worker for you. If you want to register the service worker yourself,
  set this to <InlineCode>false</InlineCode> and run <InlineCode>window.serwist.register()</InlineCode> in <InlineCode>componentDidMount</InlineCode> or
  <InlineCode>useEffect</InlineCode>.
</p>
<h2>How it works</h2>
<p>
  When set to <InlineCode>true</InlineCode>, the code injected into your app's entrypoints runs <InlineCode>window.serwist.register()</InlineCode>,
  registering the service worker. This is rerun everytime those entrypoints are loaded.
</p>
<h2>Usage</h2>
<p>In your {"next.config.{mjs,js}"}:</p>
<CodeTab codes={data.code.usage.config} defaultTab="next.config.mjs" />
<p>In your app:</p>
<CodeTab codes={data.code.usage.app} defaultTab="app/register-pwa.jsx" />
<p>
  Note: if you use TypeScript and follow the above template, do add <InlineCode>@serwist/next/typings</InlineCode> to
  <InlineCode>compilerOptions.types</InlineCode> in your tsconfig.json! This allows <InlineCode>window.serwist</InlineCode> to be automatically typed.
</p>
