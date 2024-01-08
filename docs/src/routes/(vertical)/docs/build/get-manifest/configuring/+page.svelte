<script>
  import InlineCode from "$components/InlineCode.svelte";
</script>

<h1>Configuring</h1>
<br /><br />
<h2>Available options</h2>
<br />
<p>
  GetManifest inherits <a class="link" href="/docs/build/configuring/base-options">base</a> and
  <a class="link" href="/docs/build/configuring/glob-options">glob</a>
  <InlineCode>@serwist/build</InlineCode> options and provides a few more:
</p>
<br />
<ul class="list">
  <li>
    <InlineCode>globDirectory</InlineCode> - The local directory you wish to match <InlineCode>globPatterns</InlineCode> against. The path is relative
    to the current directory.
  </li>
</ul>
