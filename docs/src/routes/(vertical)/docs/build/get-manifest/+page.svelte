<script>
  import CodeTab from "$components/CodeTab.svelte";
  import InlineCode from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1>GetManifest</h1>
<h2>Introduction</h2>
<p>
  GetManifest is a mode of <InlineCode>@serwist/build</InlineCode> which generates a manifest of local files that should be precached and returns it alongside
  a list of warnings, the number of precache entries, and the number of bytes that they accumulate to.
</p>
<h2>Getting started</h2>
<p>
  Usually, you only need to provide the path to your service worker's source, the path to its destination, and the directory in which GetManifest
  should search for files to precache.
</p>
<CodeTab codes={data.code.gettingStarted} defaultTab="build.js" />
<p>
  However, sometimes you may also want to configure GetManifest further to suit your needs. In that case, see
  <a class="link" href="/docs/build/get-manifest/configuring">Configuring</a>.
</p>
