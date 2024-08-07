<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1 id="getting-started">Getting started</h1>
<Callout>
  This guide uses React, but it applies to any project using webpack. For some frameworks, we also have packages tailored to them:
  <ul class="list-inside list-disc">
    <li><a class="link" href="/docs/next">Next.js</a></li>
  </ul>
</Callout>
<h2 id="install">Install</h2>
<p>Run the following command:</p>
<CodeTab codes={data.code.install} defaultTab="npm" />
<h2 id="implementation">Implementation</h2>
<h3 id="adding-plugin">Step 1: Add Serwist's webpack plugin</h3>
<p>Update or create your webpack configuration file with the following content:</p>
<CodeTab codes={data.code.basicUsage.wrapConfig} defaultTab="webpack.config.ts" />
<h3 id="updating-tsconfig">Step 2: Update tsconfig.json</h3>
<p>If you use TypeScript, you should add the following content to tsconfig.json in order to get the correct types:</p>
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
<p>Update public/manifest.json with the following content:</p>
<CodeTab codes={data.code.basicUsage.manifestJson} defaultTab="manifest.json" />
<h3 id="updating-entrypoint">Step 6: Update your client entrypoint</h3>
<p>Next up, update src/App.tsx with the following content:</p>
<CodeTab codes={data.code.basicUsage.registerSw} defaultTab="src/App.tsx" />
<h3 id="updating-html">
  Step 7: Add metadata to {"<head />"}
</h3>
<p>Add the following content to your HTML file:</p>
<CodeTab codes={data.code.basicUsage.metaAndLinkTags} defaultTab="index.html" />
