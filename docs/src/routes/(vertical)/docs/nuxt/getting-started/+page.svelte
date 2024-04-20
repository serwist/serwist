<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";

  const { data } = $props();
</script>

<h1 id="getting-started">Getting started</h1>
<h2 id="install">Install</h2>
<p>Run the following command:</p>
<CodeTab codes={data.code.install} defaultTab="npm" />
<h2 id="implementation">Implementation</h2>
<h3 id="adding-module">Step 1: Add Serwist's Nuxt module and add metadata to {"<head />"}</h3>
<p>Update or create your Nuxt configuration file with the following content:</p>
<CodeTab codes={data.code.basicUsage.wrapConfig} defaultTab="nuxt.config.ts" />
<h3 id="updating-tsconfig">Step 2: Update tsconfig.json</h3>
<p>If you use TypeScript, you should add the following content to tsconfig.json in order to get the correct types:</p>
<CodeTab codes={data.code.basicUsage.tsConfig} defaultTab="tsconfig.json" />
<p>Otherwise, safely skip this step.</p>
<h3 id="writing-a-sw">Step 3: Create a service worker</h3>
<p>Basic service worker template to get Serwist up and running:</p>
<CodeTab codes={data.code.basicUsage.createEntry} defaultTab="sw.ts" />
<h3 id="writing-a-webmanifest">Step 4: Add a web application manifest</h3>
<p>Update public/manifest.json with the following content:</p>
<CodeTab codes={data.code.basicUsage.manifestJson} defaultTab="manifest.json" />
<h3 id="updating-layout">Step 5: Register the service worker</h3>
<p>Add the following content to app.vue:</p>
<CodeTab codes={data.code.basicUsage.metaAndLinkTags} defaultTab="app.vue" />
