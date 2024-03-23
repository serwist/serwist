<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<p>
  Serwist 9.0.0 is a cleanup, dropping various Workbox relics no longer needed. As a result, it is packed with changes that require manual migration.
  This blog aims to list noticeable changes and help you upgrade in the process.
</p>
<h2 id="misc">Misc changes</h2>
<h3 id="dropped-the-commonjs-build">Dropped the CommonJS build</h3>
<p>
  This was done because our tooling around supporting CJS had always been crappy: it was slow, had no way of supporting emitting .d.cts (we used to
  copy .d.ts to .d.cts), was too error-prone (there were various issues of our builds crashing due to an ESM-only package slipping in), and yielded
  gargantuan results (we had to bundle ESM-only packages).
</p>
<div>
  <p>If you already use ESM, there's nothing to be done. Great! Otherwise, to migrate:</p>
  <ul class="list">
    <li>
      Migrate to ESM if possible.
      <ul class="list">
        <li>
          Add <ICD>"type": "module"</ICD> to "package.json" or change the extension of files that use Serwist's Node.js APIs to ".mjs" or ".mts".
        </li>
      </ul>
    </li>
    <li>
      If that is not possible, use dynamic imports. For example, to migrate to the new <ICD>@serwist/next</ICD>:
      <CodeTab codes={data.code.misc.esmOnly} defaultTab="Old" />
    </li>
    <li>
      If all else fails, use <ICD>require(esm)</ICD>. See
      <a class="link" href="https://github.com/nodejs/node/commit/5f7fad26050cd574431e3018a557bc6eae5ff716" target="_blank" rel="noreferrer">
        the related Node.js commit
      </a> for more information. This may or may not be supported on your current Node.js version.
    </li>
  </ul>
</div>
<h3 id="bumped-minimum-supported-ts-node">Bumped minimum supported TypeScript and Node.js versions</h3>
<p>From now on, Serwist only supports TypeScript and Node.js versions newer than 5.0.0 and 18.0.0 respectively.</p>
<p>To migrate, simply update these tools.</p>
<CodeTab codes={data.code.misc.minimumSupportedTsNode} defaultTab="bash" />
<h3 id="ship-ts-source">Ship TypeScript source</h3>
<p>
  Serwist now ships TS source files and declaration maps alongside bundled code. This allows you to read the source code without the hassle of having
  to go to GitHub and navigate through the files.
</p>
