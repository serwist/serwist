<script>
  import InlineCode from "$components/InlineCode.svelte";
</script>

<h1>Welcome to <InlineCode>@serwist/build</InlineCode>!</h1>
<br /><br />
<h2>Introduction</h2>
<br />
<p>
  <InlineCode>@serwist/build</InlineCode> is a module that integrates into your build process, helping you generate a manifest of local files that should
  be precached.
</p>
<br /><br />
<h2>Available modes</h2>
<br />
<ul class="list">
  <li>
    <a class="link" href="/docs/build/inject-manifest">InjectManifest</a> - Generates a manifest of local files that should be precached, injects it into
    the service worker, and returns a list of warnings, the number of precache entries, and the number of bytes that they accumulate to.
  </li>
  <li>
    <a class="link" href="/docs/build/get-manifest">GetManifest</a> - Although this mode is conceptually similar to InjectManifest, it simply returns the
    manifest alongside other details that InjectManifest also returns instead of injecting it into the source.
  </li>
</ul>
<br /><br />
<h2>Each mode's use cases</h2>
<br />
<h3>When to use InjectManifest?</h3>
<br />
<ul class="list">
  <li>You want Serwist to inject the precache manifest for you.</li>
</ul>
<br />
<h3>When to use GetManifest?</h3>
<br />
<ul class="list">
  <li>You want to have even more postprocess control over the precache manifest and inject it into the service worker yourself.</li>
</ul>
<br /><br />
<h2>Configuring</h2>
<br />
<p>See <a class="link" href="/docs/build/configuring">Configuring</a>.</p>
