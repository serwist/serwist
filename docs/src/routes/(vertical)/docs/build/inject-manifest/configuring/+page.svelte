<script>
  import InlineCode from "$components/InlineCode.svelte";
</script>

<h1>Configuring</h1>
<br /><br />
<h2>Available options</h2>
<br />
<p>
  InjectManifest inherits <a class="link" href="/docs/build/configuring/base-options">base</a> and
  <a class="link" href="/docs/build/configuring/glob-options">glob</a>
  <InlineCode>@serwist/build</InlineCode> options and provides a few more:
</p>
<br />
<ul class="list">
  <li>
    <InlineCode>injectionPoint</InlineCode> - The string to find inside of the `swSrc` file. Once found, it will be replaced by the generated precache
    manifest.
  </li>
  <li>
    <InlineCode>swSrc</InlineCode> - The path to the service worker file that will be read during the build process, relative to the current working directory.
    <br />
  </li>
  <li>
    <InlineCode>swDest</InlineCode> - The path and filename of the service worker file that will be created by the build process, relative to the current
    working directory. It must end in '.js'.
  </li>
</ul>
