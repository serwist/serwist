<script>
  import InlineCode from "$components/InlineCode.svelte";
</script>

<h1 id="serwist-build">@serwist/build</h1>
<br /><br />
<h2 id="introduction">Introduction</h2>
<br />
<p>
  <InlineCode>@serwist/build</InlineCode> is a module that integrates into your build
  process, helping you generate a manifest of local files that should be precached.
</p>
<br /><br />
<h2 id="available-modes">Available modes</h2>
<br />
<ul class="list">
  <li>
    <a class="link" href="/docs/build/inject-manifest">InjectManifest</a> — Generates
    a manifest of local files that should be precached, injects it into the service
    worker, and returns a list of warnings, the number of precache entries, and the
    number of bytes that they accumulate to.
  </li>
  <li>
    <a class="link" href="/docs/build/get-manifest">GetManifest</a> — Although this
    mode is conceptually similar to InjectManifest, it simply returns the manifest
    alongside other details that InjectManifest also returns instead of injecting
    it into the source.
  </li>
</ul>
<br /><br />
<h2 id="each-modes-use-cases">Each mode's use cases</h2>
<br />
<h3 id="when-to-use-injectmanifest">When to use InjectManifest?</h3>
<br />
<ul class="list">
  <li>You want Serwist to inject the precache manifest for you.</li>
</ul>
<br />
<h3 id="when-to-use-getmanifest">When to use GetManifest?</h3>
<br />
<ul class="list">
  <li>
    You want to have even more postprocess control over the precache manifest
    and inject it into the service worker yourself.
  </li>
</ul>
<br /><br />
<h2 id="configuring">Configuring</h2>
<br />
<p>See <a class="link" href="/docs/build/configuring">Configuring</a>.</p>
<br /><br />
<h2>Frameworks</h2>
<br />
<p>
  If you are using a framework, chances are that this module isn't for you. We
  have already implemented integrations that use this module under the hood for
  various frameworks, bundlers, and build tools:
</p>
<br />
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
