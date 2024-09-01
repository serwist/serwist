<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1 id="getting-started">Getting started</h1>
<h2 id="install">Install</h2>
<p>Run the following command:</p>
<CodeTab codes={data.code.install} defaultTab="npm" />
<h2 id="implementation">Implementation</h2>
<h3 id="adding-plugin">Step 1: Wrap your Next.js config with withSerwist</h3>
<p>Update or create your Next.js configuration file with the following content:</p>
<CodeTab codes={data.code.basicUsage.wrapConfig} defaultTab="next.config.mjs" />
<h3 id="updating-tsconfig">Step 2: Update tsconfig.json</h3>
<p>If you use TypeScript, add the following content to tsconfig.json in order to get the correct types:</p>
<CodeTab codes={data.code.basicUsage.tsConfig} defaultTab="tsconfig.json" />
<p>Otherwise, safely skip this step.</p>
<h3 id="updating-gitignore">Step 3: Update .gitignore</h3>
<p>If you use Git, update your .gitignore like so:</p>
<CodeTab codes={data.code.basicUsage.gitignore} defaultTab=".gitignore" />
<p>Otherwise, safely skip this step.</p>
<h3 id="writing-a-sw">Step 4: Create a service worker</h3>
<p>Basic service worker template to get Serwist up and running:</p>
<CodeTab codes={data.code.basicUsage.createEntry} defaultTab="sw.ts" />
<h3 id="writing-a-webmanifest">Step 5: Add a web application manifest</h3>
<p>Update app/manifest.json (App Router) or public/manifest.json (Pages Router) with the following content:</p>
<CodeTab codes={data.code.basicUsage.manifestJson} defaultTab="manifest.json" />
<h3 id="updating-layout">
  Step 6: Add metadata to {"<head />"}
</h3>
<p>Add the following content to app/layout.tsx or pages/_app.tsx:</p>
<CodeTab codes={data.code.basicUsage.metaAndLinkTags} defaultTab="app/layout.tsx" />
