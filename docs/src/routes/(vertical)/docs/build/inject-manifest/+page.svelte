<script>
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>InjectManifest</h1>
<h2>Introduction</h2>
<p>
  InjectManifest is the most common mode of <InlineCode>@serwist/build</InlineCode> and also the only supported one in most Serwist integrations with frameworks,
  bundlers, and build tools.
</p>
<p>
  It generates a manifest of local files that should be precached, injects it into the service worker, and returns a list of warnings, the number of
  precache entries, and the number of bytes that they accumulate to.
</p>
<h2>Getting started</h2>
<p>
  Usually, you only need to provide the path to your service worker's source, the path to its destination, and the directory in which InjectManifest
  should search for files to precache.
</p>
<CodeTab codes={data.code.gettingStarted} defaultTab="build.js" />
<p>
  However, sometimes you may also want to configure InjectManifest further to suit your needs. In that case, see
  <a class="link" href="/docs/build/inject-manifest/configuring">Configuring</a>.
</p>
