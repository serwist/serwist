<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist-cli">@serwist/cli</h1>
<ExternalLink class="link" href="https://developer.chrome.com/docs/workbox/modules/workbox-cli">
  Original source (Apache 2.0 License). Adapted for Serwist's usage.
</ExternalLink>
<h2 id="introduction">Introduction</h2>
<p>
  The Serwist command line interface consists of a Node.js program that can be run from a command line environment. It provides an easy way of
  integrating Serwist into a command line build process.
</p>
<h2 id="install">Install</h2>
<p>To install the CLI with Node.js, run the following command in your terminal:</p>
<CodeTab codes={data.code.install} defaultTab="npm" />
<h2 id="commands">Commands</h2>
<p>The CLI provides two main commands:</p>
<ul class="list">
  <li><ICD>wizard</ICD> — Runs the configuration wizard, which will generate a config file based on answers to questions.</li>
  <li>
    <ICD>inject-manifest</ICD> — Takes an existing service worker file and creates a copy of it with a precache manifest injected. The precache manifest
    is generated based on the options in the config file (defaults to "serwist.config.js"). If <ICD>--watch</ICD> is provided, the CLI will stay running
    and rebuild the service worker each time a file in the precache manifest changes.
  </li>
</ul>
<h3 id="command-wizard">wizard</h3>
<p>The Serwist wizard asks a series of questions, the answers to which are then used to generate a configuration file.</p>
<p>Most developers will only need to run the wizard once, and you're free to manually customize the initial configuration file that's generated.</p>
<p>To start the wizard run:</p>
<CodeTab codes={data.code.wizard} defaultTab="npm" />
<enhanced:img
  class="my-3 h-auto w-full"
  sizes="min(1089px, 100vw)"
  src="$images/serwist-wizard.png"
  alt="An example wizard run where the questions are listed alongside example answers"
/>
<h3 id="command-inject">inject-manifest</h3>
<p>
  When <ICD>inject-manifest</ICD> is run, it looks for a specific string, <ICD>self.__WB_MANIFEST</ICD> by default, in your source service worker file,
  replaces it with a list of URLs to precache, and writes the service worker file to its destination location. The rest of the code in your source service
  worker is left untouched. You may want to use an additional tool to bundle the resulting service worker for you.
</p>
<p>To run the command:</p>
<CodeTab codes={data.code.injectManifest} defaultTab="npm" />
<h2 id="configuration">Configuration</h2>
<p>
  Edit your config file. The full set of configuration options can be found in <a class="link" href="/docs/build/configuring">
    the reference documentation
  </a>.
</p>
<h2 id="is-cli-right">Is @serwist/cli the right choice for my build process?</h2>
<p>If you have an existing build process that is based entirely on npm scripts, then <ICD>@serwist/cli</ICD> is a good choice.</p>
<p>
  If you are using webpack, Vite, Next.js, or SvelteKit, Serwist provides
  <a class="link" href="/docs/webpack-plugin"><ICD>@serwist/webpack-plugin</ICD></a>,
  <a class="link" href="/docs/vite"><ICD>@serwist/vite</ICD></a>,
  <a class="link" href="/docs/next"><ICD>@serwist/next</ICD></a>, and <a class="link" href="/docs/svelte"><ICD>@serwist/svelte</ICD></a> respectively.
</p>
<p>
  If you're currently using Gulp, Grunt, or some other Node.js-based build tool, integrating
  <a class="link" href="/docs/build"><ICD>@serwist/build</ICD></a> into your build script should be preferred.
</p>
