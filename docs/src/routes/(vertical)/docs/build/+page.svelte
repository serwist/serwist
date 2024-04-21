<script>
  import InlineCode from "$components/InlineCode.svelte";
</script>

<h1 id="serwist-build">@serwist/build</h1>
<h2 id="introduction">Introduction</h2>
<p>
  <InlineCode>@serwist/build</InlineCode> is a module that integrates into your build process, helping you generate a manifest of local files that should
  be precached.
</p>
<h2 id="available-modes">Available modes</h2>
<ul class="list">
  <li>
    InjectManifest — Generates a manifest of local files that should be precached, injects it into the service worker, and returns a list of warnings,
    the number of precache entries, and the number of bytes that they accumulate to.
  </li>
  <li>GetManifest — Conceptually similar to InjectManifest, but it simply returns the manifest instead of injecting it into the source.</li>
</ul>
<h2 id="each-modes-use-cases">Each mode's use cases</h2>
<h3 id="when-to-use-injectmanifest">When to use InjectManifest?</h3>
<ul class="list">
  <li>You want Serwist to inject the precache manifest for you.</li>
</ul>
<h3 id="when-to-use-getmanifest">When to use GetManifest?</h3>
<ul class="list">
  <li>You want to have even more postprocess control over the precache manifest and inject it into the service worker yourself.</li>
</ul>
<h2 id="configuration">Configuration</h2>
<p>See <a class="link" href="/docs/build/configuring">Configuring</a>.</p>
<h2>Frameworks</h2>
<p>
  If you are using a framework, chances are that this module isn't for you. We have already implemented integrations that use this module under the
  hood for various frameworks, bundlers, and build tools:
</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/next">Next.js</a>
  </li>
  <li>
    <a class="link" href="/docs/nuxt">Nuxt</a>
  </li>
  <li>
    <a class="link" href="/docs/svelte">Svelte</a>
  </li>
  <li>
    <a class="link" href="/docs/webpack-plugin">webpack</a>
  </li>
  <li>
    <a class="link" href="/docs/vite">Vite</a>
  </li>
</ul>
