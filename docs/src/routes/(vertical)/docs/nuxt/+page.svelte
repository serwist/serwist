<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist-nuxt">@serwist/nuxt</h1>
<h2 id="introduction">Introduction</h2>
<p>
  <ICD>@serwist/nuxt</ICD> is a module that integrates Serwist into your Nuxt application.
</p>
<h2 id="getting-started">Getting started</h2>
<p>
  See <a class="link" href="./nuxt/getting-started">Getting started</a>. If you are initializing a new project, you can also run the following
  command:
</p>
<CodeTab codes={data.code.degit} defaultTab="npm" />
<h2 id="configuring">Configuring</h2>
<p>
  See <a class="link" href="./vite/configuring">Configuring</a>.
</p>
<h2 id="alternatives">Alternatives</h2>
<p>
  There are also some alternatives to <ICD>@serwist/nuxt</ICD>:
</p>
<ul class="list">
  <li>
    <a class="link" href="./vite">@serwist/vite</a>
  </li>
  <li>
    <ExternalLink class="link" href="https://vite-pwa-org.netlify.app/">Vite PWA</ExternalLink> (<ICD>@serwist/nuxt</ICD> is actually a fork of this project!)
  </li>
</ul>
