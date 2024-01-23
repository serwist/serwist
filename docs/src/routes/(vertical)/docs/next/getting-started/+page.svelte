<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>Getting started</h1>
<br /><br />
<h2>Install</h2>
<br />
<p>Run the following command:</p>
<br />
<CodeTab codes={data.code.install} defaultTab="npm" />
<br /><br />
<h2>Basic usage</h2>
<br />
<h3>
  Step 1: Wrap your Next.js config with <InlineCode>withSerwist</InlineCode>
</h3>
<br />
<p>Update or create next.config.js with the following content:</p>
<br />
<CodeTab codes={data.code.basicUsage.wrapConfig} defaultTab="next.config.mjs" />
<br /><br />
<h3>Step 2: Create a app/sw.ts or app/sw.js file</h3>
<br />
<p>Basic template:</p>
<br />
<CodeTab codes={data.code.basicUsage.createEntry} defaultTab="app/sw.ts" />
<br />
<p>
  If you use the template shown above, make sure you also install the following additional dependencies:
</p>
<br />
<CodeTab
  codes={data.code.basicUsage.createEntryAdditionalPackages}
  defaultTab="npm"
/>
<br /><br />
<h3>Step 3: Add a manifest.(json|webmanifest) file</h3>
<br />
<p>Create or generate a manifest file in the root of your /app folder:</p>
<br />
<CodeTab
  codes={[data.code.basicUsage.manifestJson]}
  defaultTab="app/manifest.json"
/>
<br /><br />
<h3>
  Step 4: Add <InlineCode>{"<meta />"}</InlineCode> and
  <InlineCode>{"<link />"}</InlineCode> tags to your
  <InlineCode>{"<head />"}</InlineCode>
</h3>
<br />
<p>Add the following to your app/layout.tsx or pages/_app.tsx:</p>
<br />
<CodeTab
  codes={data.code.basicUsage.metaAndLinkTags}
  defaultTab="app/layout.tsx"
/>
<br /><br />
<h3>Step 5: Typescript</h3>
<br />
<p>When using Typescript, you can add the following config to your tsconfig.json file in order to get the correct types:</p>
<CodeTab
  codes={data.code.basicUsage.tsConfig}
  defaultTab="tsconfig.json"
/>