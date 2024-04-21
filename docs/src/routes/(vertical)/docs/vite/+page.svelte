<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="serwist-vite">@serwist/vite</h1>
<h2 id="introduction">Introduction</h2>
<p>
  <ICD>@serwist/vite</ICD> is a module that integrates Serwist into your Vite application.
</p>
<h2 id="getting-started">Getting started</h2>
<p>
  See <a class="link" href="./vite/getting-started">Getting started</a>. If you are initializing a new Vite + React project, you can also run the
  following command:
</p>
<CodeTab codes={data.code.degit} defaultTab="npm" />
<h2 id="configuring">Configuring</h2>
<p>
  See <a class="link" href="./vite/configuring">Configuring</a>.
</p>
<h2 id="alternatives">Alternatives</h2>
<p>
  There are also some alternatives to <ICD>@serwist/vite</ICD>:
</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://vite-pwa-org.netlify.app/">Vite PWA</ExternalLink> (<ICD>@serwist/vite</ICD> is actually a fork of this project!)
  </li>
</ul>
