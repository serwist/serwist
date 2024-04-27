<script lang="ts">
  import Callout from "$components/Callout.svelte";
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
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
<video class="aspect-video rounded-xl" muted controls src="/2024-03-10-serwist-v9-ship-ts-source.mp4" />
<h2 id="core-changes">Core changes</h2>
<p>These are the changes done to the core <ICD>serwist</ICD> package.</p>
<h3 id="merged-service-worker-packages">Merged all service worker packages</h3>
<p>In 9.0.0, all service worker packages have been merged into one single unified package:</p>
<ul class="list">
  <li><ICD>@serwist/core</ICD></li>
  <li><ICD>@serwist/background-sync</ICD></li>
  <li><ICD>@serwist/broadcast-update</ICD></li>
  <li><ICD>@serwist/cacheable-response</ICD></li>
  <li><ICD>@serwist/expiration</ICD></li>
  <li><ICD>@serwist/google-analytics</ICD></li>
  <li><ICD>@serwist/navigation-preload</ICD></li>
  <li><ICD>@serwist/precaching</ICD></li>
  <li><ICD>@serwist/range-requests</ICD></li>
  <li><ICD>@serwist/routing</ICD></li>
  <li><ICD>@serwist/strategies</ICD></li>
  <li><ICD>@serwist/sw</ICD></li>
</ul>
<p>This new package is now available on npm:</p>
<CodeTab codes={data.code.installSerwist} defaultTab="npm" />
<p>To migrate, simply run the above command and remove all the legacy packages. Then update the imports so that they point to <ICD>serwist</ICD>.</p>
<p>
  The behaviour of some items may change when you update your imports. For example, passing a
  <ICD>Router</ICD> instance to <ICD>@serwist/google-analytics.initialize</ICD> is optional, but passing a
  <ICD>Serwist</ICD> instance to <ICD>serwist.initializeGoogleAnalytics()</ICD> is required. To help with your migration to <ICD>serwist</ICD>,
  functions whose behaviour have changed also have their legacy counterparts. These are exported from <ICD>serwist/legacy</ICD> alongside items that have
  been deprecated. However, they will be removed in v10.
</p>
<Callout type="info">
  Serwist does not aim to be compatible across all of its major versions. Rather, it only gives you one single major version to migrate from its
  deprecated APIs, after which point, you may no longer upgrade Serwist until you have migrated. It is worth noting that some legacy APIs still
  received some breaking changes and new features as detailed later.
</Callout>
<p>
  The following are items you can import from <ICD>serwist/legacy</ICD>:
</p>
<ul class="list">
  <li><ICD>@serwist/precaching.addPlugins</ICD> (deprecated)</li>
  <li><ICD>@serwist/precaching.addRoute</ICD> (deprecated)</li>
  <li><ICD>@serwist/precaching.createHandlerBoundToURL</ICD> (deprecated)</li>
  <li><ICD>@serwist/precaching.getCacheKeyForURL</ICD> (deprecated)</li>
  <li><ICD>@serwist/precaching.matchPrecache</ICD> (deprecated)</li>
  <li><ICD>@serwist/precaching.precache</ICD> (deprecated)</li>
  <li><ICD>@serwist/precaching.precacheAndRoute</ICD> (deprecated)</li>
  <li><ICD>@serwist/precaching.PrecacheController</ICD> (deprecated, replaced by <ICD>serwist.Serwist</ICD>)</li>
  <li><ICD>@serwist/precaching.PrecacheFallbackPlugin</ICD> (modern counterpart is <ICD>serwist.PrecacheFallbackPlugin</ICD>)</li>
  <li><ICD>@serwist/precaching.PrecacheRoute</ICD> (modern counterpart is <ICD>serwist.PrecacheRoute</ICD>)</li>
  <li><ICD>@serwist/sw.fallbacks</ICD> (deprecated, replaced by <ICD>serwist.Serwist</ICD>)</li>
  <li><ICD>@serwist/sw.handlePrecaching</ICD> (deprecated, replaced by <ICD>serwist.Serwist</ICD>)</li>
  <li><ICD>@serwist/sw.installSerwist</ICD> (deprecated, replaced by <ICD>serwist.Serwist</ICD>)</li>
  <li><ICD>@serwist/sw.registerRuntimeCaching</ICD> (deprecated, replaced by <ICD>serwist.Serwist</ICD>)</li>
  <li><ICD>@serwist/routing.registerRoute</ICD> (deprecated)</li>
  <li><ICD>@serwist/routing.Router</ICD> (deprecated, replaced by <ICD>serwist.Serwist</ICD>)</li>
  <li><ICD>@serwist/routing.setCatchHandler</ICD> (deprecated)</li>
  <li><ICD>@serwist/routing.setDefaultHandler</ICD> (deprecated)</li>
  <li>
    <ICD>@serwist/google-analytics.initialize</ICD> as <ICD>serwist/legacy.initializeGoogleAnalytics</ICD> (modern counterpart is
    <ICD>serwist.initializeGoogleAnalytics</ICD>)
  </li>
</ul>
<p>
  The following items are now internal functions. You can still import them from <ICD>serwist/internal</ICD>:
</p>
<ul class="list">
  <li><ICD>@serwist/precaching.cleanupOutdatedCaches</ICD></li>
  <li><ICD>@serwist/core.clientsClaim</ICD></li>
</ul>
<p>The rest are available in <ICD>serwist</ICD>. You can simply update the imports.</p>
<h3 id="added-serwist">Added Serwist</h3>
<p>
  <ICD>installSerwist</ICD>, <ICD>PrecacheController</ICD>, and <ICD>Router</ICD> have been merged into one single class, <ICD>Serwist</ICD>, and
  deprecated.
</p>
<p>
  The new Serwist class does NOT have a singleton instance. As such, <ICD>serwist.initializeGoogleAnalytics()</ICD> and <ICD>@serwist/recipes</ICD>'s
  functions require you to pass in your own <ICD>Serwist</ICD> instance.
</p>
<p>To migrate, see <a class="link" href="/docs/serwist/core/serwist">the reference documentation of <ICD>Serwist</ICD></a>.</p>
<h3 id="concurrent-precaching">Added support for concurrent precaching</h3>
<p>
  The <ICD>Serwist</ICD> class now accepts <ICD>precacheOptions.concurrency</ICD>, which should be the number of precache requests that should be made
  concurrently.
</p>
<p>
  With this change, Serwist now concurrently precache 10 files each by default, different from its old behaviour where it only ran this process
  sequentially.
</p>
<Callout type="info">
  This feature was also added to the legacy PrecacheController class as concurrentPrecaching. However, this class still precaches files sequentially
  by default.
</Callout>
<h3 id="renamed-urlpattern">Renamed RuntimeCaching.urlPattern to RuntimeCaching.matcher</h3>
<p>This change was done to make our naming a bit more consistent.</p>
<p>
  To migrate, simply replace <ICD>urlPattern</ICD> with <ICD>matcher</ICD>.
</p>
<h3 id="removed-string-handlers">Removed RuntimeCaching's support for string handlers</h3>
<p>
  The <ICD>runtimeCaching</ICD> option of the <ICD>Serwist</ICD> class and its legacy counterpart <ICD>registerRuntimeCaching</ICD> no longer support string
  handlers, such as <ICD>"NetworkFirst"</ICD>, <ICD>"NetworkOnly"</ICD>, <ICD>"CacheFirst"</ICD>, etc. You should migrate to passing the strategies'
  instances yourself:
</p>
<CodeTab codes={data.code.legacyStringHandlers} defaultTab="Old" />
<h3 id="fallbacks-precache-fallback-plugin">Use PrecacheFallbackPlugin for fallbacks</h3>
<p>
  The <ICD>fallbacks</ICD> option of the <ICD>Serwist</ICD> class and its legacy counterpart <ICD>installSerwist</ICD> now uses
  <ICD>PrecacheFallbackPlugin</ICD> to power its functionalities. With this change, <ICD>FallbackEntry.cacheMatchOptions</ICD> has been removed because
  it is no longer necesssary.
</p>
<p>
  With this change, the <ICD>Serwist</ICD> class no longer precaches the URLs for you, and you need to do so yourself. This can be done by using
  <ICD>additionalPrecacheEntries</ICD>. This breaking change, however, does not apply to <ICD>installSerwist</ICD>.
</p>
<h3 id="expiration-max-age-from">Added maxAgeFrom for ExpirationPlugin</h3>
<p>
  This option allows you to decide whether <ICD>maxAgeSeconds</ICD> should be calculated from when an entry was last fetched or when it was last used.
</p>
<p>
  For more information, see
  <ExternalLink class="link" href="https://github.com/GoogleChrome/workbox/issues/2863">the original Workbox issue</ExternalLink>.
</p>
<h2 id="build-packages-changes">Build packages' changes</h2>
<h3 id="build">@serwist/build</h3>
<h4 id="migrate-to-zod">Migrated to Zod</h4>
<p>Serwist now uses Zod instead of AJV.</p>
<p>This allows us to further validate the values, thanks to Zod supporting validating functions, classes, and more.</p>
<h4 id="moved-framework-types">Moved framework-specific types out of @serwist/build</h4>
<p>
  Types such as <ICD>WebpackPartial</ICD>, <ICD>WebpackInjectManifestOptions</ICD>, and <ICD>ViteInjectManifestOptions</ICD>, and their according
  validators have been moved out of <ICD>@serwist/build</ICD>.
</p>
<p>To migrate, update the imports:</p>
<ul class="list">
  <li><ICD>@serwist/build.WebpackPartial</ICD> → <ICD>@serwist/webpack-plugin.WebpackPartial</ICD></li>
  <li><ICD>@serwist/build.WebpackInjectManifestOptions</ICD> → <ICD>@serwist/webpack-plugin.InjectManifestOptions</ICD></li>
  <li>
    <ICD>@serwist/build.WebpackInjectManifestPartial</ICD> → <ICD>
      {`Omit<import("@serwist/webpack-plugin").InjectManifestOptions, keyof import("@serwist/build").BasePartial | keyof import("@serwist/build").InjectPartial | keyof import("@serwist/webpack-plugin").WebpackPartial | keyof import("@serwist/build").OptionalSwDestPartial>`}
    </ICD>
  </li>
  <li>
    <ICD>@serwist/build.ViteInjectManifestOptions</ICD> → <ICD>@serwist/vite.PluginOptions</ICD>
  </li>
</ul>
<p>With this change, validators and schemas have also been made public.</p>
<h3 id="webpack-plugin">@serwist/webpack-plugin</h3>
<h4 id="webpack-plugin-removed-mode">Removed mode</h4>
<p>This option was already a no-op before that, so this simply removes it from the types.</p>
<p>To migrate, just remove <ICD>mode</ICD> from your options.</p>
<h4 id="webpack-plugin-webpack-optional">Allow webpack to be an optional peerDependency</h4>
<p>Since we support frameworks that ship a prebundled <ICD>webpack</ICD>, such as Next.js, it would be nice if we can take advantage of that as well.</p>
<p>
  As such, <ICD>webpack</ICD> is now an optional <ICD>peerDependency</ICD> of <ICD>@serwist/webpack-plugin</ICD> and is no longer a <ICD>peerDependency</ICD>
  of <ICD>@serwist/next</ICD>.
</p>
<h3 id="next">@serwist/next</h3>
<h4 id="renamed-next-browser-to-worker">Moved worker exports from "/browser" to "/worker"</h4>
<p>
  Since the values that <ICD>@serwist/next/browser</ICD> exports are actually for use in service workers, it makes sense to rename this export path to
  <ICD>@serwist/next/worker</ICD>.
</p>
<p>To migrate, simply change all imports of <ICD>@serwist/next/browser</ICD> to those of <ICD>@serwist/next/worker</ICD>:</p>
<CodeTab codes={data.code.nextRenamedWorker} defaultTab="Old" />
<p>
  With this change, <ICD>PAGES_CACHE_NAME</ICD> has been added. Due to the fact that App Router's pages use React Server Components, we define 3
  <ICD>runtimeCaching</ICD> entries for pages in <ICD>defaultCache</ICD>, the <ICD>cacheName</ICD>s of which are
  <ICD>"pages-rsc-prefetch"</ICD>, <ICD>"pages-rsc"</ICD>, and
  <ICD>"pages"</ICD> respectively. This constant is simply an object containing those <ICD>cacheName</ICD>s. It is meant for when you want to extend
  <ICD>@serwist/next</ICD>'s default handling for pages.
</p>
<h4 id="renamed-cofen-to-con">Renamed cacheOnFrontEndNav to cacheOnNavigation</h4>
<p>Generally, we avoid using abbreviations (except for acronyms) to name Serwist's APIs.</p>
<p>To migrate, simply replace <ICD>cacheOnFrontEndNav</ICD> with <ICD>cacheOnNavigation</ICD>.</p>
<CodeTab codes={data.code.nextRenamedCon} defaultTab="Old" />
<h4 id="next-data-network-first">Changed defaultCache's "next-data"'s handler to NetworkFirst</h4>
<p>
  Using <ICD>StaleWhileRevalidate</ICD> affects <ICD>getServerSideProps</ICD>'s freshness. See
  <ExternalLink class="link" href="https://github.com/serwist/serwist/issues/74">the related issue</ExternalLink> for more details.
</p>
<h3 id="svelte">@serwist/svelte</h3>
<h4 id="moved-svelte-integration">Moved Serwist's Svelte integration into a separate package</h4>
<p>With this change, <ICD>@serwist/svelte</ICD> no longer makes use of any of the Serwist build tools.</p>
<p>
  This is because SvelteKit itself is capable of generating a list of precache manifest, and we'd like to leverage that capability. Essentially,
  Serwist, from now, only handles the service worker side for SvelteKit.
</p>
<p>
  If the old behaviour is preferred, <a class="link" href="/docs/vite/recipes/svelte">manual integration</a> is required.
</p>
<p>
  To migrate, uninstall <ICD>@serwist/vite</ICD>, remove <ICD>@serwist/vite/integration/svelte.serwist</ICD> from your Vite config file, install
  <ICD>@serwist/svelte</ICD>, and then update your service worker:
</p>
<CodeTab codes={data.code.svelteMigration} defaultTab="Old" />
<h3 id="vite">@serwist/vite</h3>
<h4 id="moved-get-serwist">Moved getSerwist from @serwist/vite/browser to virtual:serwist</h4>
<p>
  <ICD>getSerwist</ICD> required <ICD>@serwist/vite</ICD> to provide it build time information through virtual modules. However, this seemed to cause bugs
  in development mode, and it is not a great pattern to use. As such, we are moving <ICD>getSerwist</ICD> from <ICD>@serwist/vite/browser</ICD> to
  <ICD>virtual:serwist</ICD>.
</p>
<p>To migrate, simply update the import.</p>
<CodeTab codes={data.code.viteVirtual} defaultTab="Old" />
<p>
  If you use TypeScript, you may also want to add <ICD>@serwist/vite/typings</ICD> to <ICD>compilerOptions.types</ICD> so Serwist can properly type the
  virtual module for you.
</p>
