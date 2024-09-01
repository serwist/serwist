<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="recipe-svelte">SvelteKit</h1>
<h2 id="introduction">Introduction</h2>
<p>
  As a simple wrapper over SvelteKit's built-in service worker support, <ICD>@serwist/svelte</ICD> does not do the versioning itself; rather, it relies
  on SvelteKit to give it a revision, which will be used to construct a valid precache manifest. However, this revision is shared across all assets, excluding
  static assets if <ICD>staticRevisions</ICD> is set, and each time your app is rebuilt, its value changes, causing your service worker to have to precache
  everything all over again. Sometimes you may want the precaching to be more efficient in that the revision of each asset is unique and stable, and that's
  where <ICD>@serwist/vite</ICD> comes in: it can generate a valid and efficient precache manifest for you. This page serves as a guide to help you integrate
  <ICD>@serwist/vite</ICD> into your SvelteKit application.
</p>
<h2 id="install">Install</h2>
<p>Run the following command:</p>
<CodeTab codes={data.code.install} defaultTab="npm" />
<h2 id="implementation">Implementation</h2>
<h3 id="updating-tsconfig">Step 1: Update tsconfig.json</h3>
<p>If you use TypeScript, you should add the following content to tsconfig.json in order to get the correct types:</p>
<CodeTab codes={data.code.tsConfig} defaultTab="tsconfig.json" />
<p>Otherwise, safely skip this step.</p>
<h3 id="updating-gitignore">Step 2: Update .gitignore</h3>
<p>If you use Git, update your .gitignore like so:</p>
<CodeTab codes={data.code.gitignore} defaultTab=".gitignore" />
<p>Otherwise, safely skip this step.</p>
<h3 id="configuring-svelte">Step 3: Configure SvelteKit</h3>
<p>
  Then, configure SvelteKit so that it does not automatically register your service worker. This is, by default, done when it detects a service worker
  in your source tree.
</p>
<CodeTab codes={data.code.svelteConfig} defaultTab="svelte.config.js" />
<h3 id="configuring-vite">Step 4: Configure Vite</h3>
<p>Next, write a small Vite plugin:</p>
<CodeTab codes={data.code.viteConfig} defaultTab="vite.config.ts" />
<p>
  The configuration in the code above aims to precache all static assets and prerendered pages, same as <ICD>@serwist/svelte</ICD>'s behaviour.
  However, each asset is versioned based on either its content or its URL rather than the whole app's version.
</p>
<p>
  For immutable assets, we tell Serwist that they are uniquely versioned via their URLs through the use of <ICD>dontCacheBustURLsMatching</ICD>. This
  causes the <ICD>revision</ICD> of these assets to be <ICD>null</ICD>.
</p>
<h3 id="writing-a-sw">Step 5: Write a service worker</h3>
<p>As always, you need to write a service worker:</p>
<CodeTab codes={data.code.serviceWorker} defaultTab="src/service-worker.ts" />
<h3 id="adding-webmanifest">Step 6: Add a web application manifest</h3>
<p>We are almost there! To turn your website into a PWA, write a web application manifest:</p>
<CodeTab codes={data.code.manifestJson} defaultTab="static/manifest.json" />
<h3 id="updating-layout">Step 7: Register the service worker and add metadata to {"<head />"}</h3>
<p>Finally, update the app's main layout:</p>
<CodeTab codes={data.code.register} defaultTab="+layout.svelte" />
