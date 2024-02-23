<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="getting-started">Getting started</h1>
<br /><br />
<h2 id="install">Install</h2>
<br />
<p>Run the following command:</p>
<br />
<CodeTab codes={data.code.install} defaultTab="npm" />
<br /><br />
<h2 id="basic-usage">Basic usage</h2>
<br />
<h3 id="basic-usage-wrap-next-config">
  Step 1: Wrap your Next.js config with <InlineCode>withSerwist</InlineCode>
</h3>
<br />
<p>Update or create next.config.js with the following content:</p>
<br />
<CodeTab codes={data.code.basicUsage.wrapConfig} defaultTab="next.config.mjs" />
<br /><br />
<h3 id="basic-usage-update-tsconfig">Step 2: Update tsconfig.json</h3>
<br />
<p>If you use TypeScript, you should add the following content to tsconfig.json in order to get the correct types:</p>
<br />
<CodeTab codes={data.code.basicUsage.tsConfig} defaultTab="tsconfig.json" />
<br />
<p>Otherwise, safely skip this step.</p>
<br /><br />
<h3 id="basic-usage-create-sw">Step 3: Create a service worker</h3>
<br />
<p>Basic service worker template to get Serwist up and running:</p>
<br />
<CodeTab codes={data.code.basicUsage.createEntry} defaultTab="sw.ts" />
<br />
<p>If you use the template shown above, make sure you also install the following additional dependencies:</p>
<br />
<CodeTab codes={data.code.basicUsage.createEntryAdditionalPackages} defaultTab="npm" />
<br /><br />
<h3 id="basic-usage-add-manifest">Step 4: Add a web application manifest</h3>
<br />
<p>Update app/manifest.json (App Router) or public/manifest.json (Pages Router) with the following content:</p>
<br />
<CodeTab codes={[data.code.basicUsage.manifestJson]} defaultTab="manifest.json" />
<br /><br />
<h3 id="basic-usage-add-metadata">
  Step 5: Add metadata to <InlineCode>{"<head />"}</InlineCode>
</h3>
<br />
<p>Add the following content to app/layout.tsx or pages/_app.tsx:</p>
<br />
<CodeTab codes={data.code.basicUsage.metaAndLinkTags} defaultTab="app/layout.tsx" />
