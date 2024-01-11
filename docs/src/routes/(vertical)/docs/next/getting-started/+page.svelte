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
<h3>Step 2: Create app/sw.ts or app/sw.js</h3>
<br />
<p>Basic template:</p>
<br />
<CodeTab codes={data.code.basicUsage.createEntry} defaultTab="app/sw.ts" />
<br />
<p>
  If you follow the above template, you have to install these additional
  packages:
</p>
<br />
<CodeTab
  codes={data.code.basicUsage.createEntryAdditionalPackages}
  defaultTab="npm"
/>
<br /><br />
<h3>Step 3: Change your tsconfig.json if you use TypeScript</h3>
<br />
<CodeTab
  codes={data.code.basicUsage.tsConfig}
  defaultTab="tsconfig.json"
/>
<br /><br />
<h3>Step 4: Add a manifest.json file</h3>
<br />
<p>Create a manifest.json file in your public folder:</p>
<br />
<CodeTab
  codes={[data.code.basicUsage.manifestJson]}
  defaultTab="public/manifest.json"
/>
<br /><br />
<h3>
  Step 5: Add <InlineCode>{"<meta />"}</InlineCode> and
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
