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
  This was done because our tooling around supporting CJS had always been crappy: it was slow, had no way of supporting emitting ".d.cts" files (we
  used to duplicate ".d.ts" files as ".d.cts" ones), was too error-prone (there were various occasions in which our builds don't work for CommonJS due
  to ESM-only packages slipping in through imports), and yielded gargantuan results (we had to manually list and bundle ESM-only packages).
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
<video class="rounded-xl" muted controls src="/2024-03-10-serwist-v9-ship-ts-source.mp4" />
<h2 id="service-worker-packages-changes">Service worker packages' changes</h2>
<h2 id="build-packages-changes">Build packages' changes</h2>
<h3 id="webpack-plugin">@serwist/webpack-plugin</h3>
<h4 id="webpack-plugin-removed-mode">Removed mode</h4>
<p>This option was already a no-op before that, so this simply removes it from the types.</p>
<p>To migrate, just remove mode from your options.</p>
<h4>Allow webpack to be an optional peerDependency</h4>
<p>Since we support frameworks that ship a prebundled webpack, such as Next.js, it would be nice if we can take advantage of that as well.</p>
<p>
  As a result, webpack is now an optional peerDependency for @serwist/webpack-plugin and is no longer a peerDependency for @serwist/next. Thanks to
  the fact that we currently don't use any webpack plugin, it is also not indirectly installed.
</p>
