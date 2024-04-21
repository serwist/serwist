<script>
  import ICD from "$components/InlineCode.svelte";
</script>

<h1 id="serwist">serwist</h1>
<h2 id="introduction">Introduction</h2>
<p>
  <ICD>serwist</ICD> is the core of Serwist. It contains tools designed to help you write service workers with ease. Have a look around:
</p>
<ul class="list">
  <li>
    <a class="link" href="./serwist/core">Using the Serwist API</a>
  </li>
  <li>
    <a class="link" href="./serwist/guide/background-syncing">Background synchronizing</a>
  </li>
  <li>
    <a class="link" href="./serwist/guide/broadcasting-updates">Broadcasting cache updates</a>
  </li>
  <li>
    <a class="link" href="./serwist/guide/expiring-outdated-responses">Expiring outdated responses</a>
  </li>
  <li>
    <a class="link" href="./serwist/guide/navigation-preloading">Preloading navigations</a>
  </li>
  <li>
    <a class="link" href="./serwist/guide/precaching">Precaching assets</a>
  </li>
  <li>
    <a class="link" href="./serwist/guide/setting-cacheability-criteria">Setting cacheability criteria</a>
  </li>
  <li>
    <a class="link" href="./serwist/runtime-caching">Runtime caching</a>
  </li>
</ul>
<h2 id="api">The Serwist API</h2>
<p>Here lists those which <ICD>serwist</ICD> offers:</p>
<ul class="list">
  <li>
    Core functions
    <ul class="list">
      <li>
        <a class="link" href="./serwist/core/background-sync-queue">BackgroundSyncQueue</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/broadcast-cache-update">BroadcastCacheUpdate</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/cacheable-response">CacheableResponse</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/cache-expiration">CacheExpiration</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/disable-dev-logs">disableDevLogs</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/disable-navigation-preload">disableNavigationPreload</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/enable-navigation-preload">enableNavigationPreload</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/is-navigation-preload-supported">isNavigationPreloadSupported</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/serwist">Serwist</a>
      </li>
      <li>
        <a class="link" href="./serwist/core/responses-are-same">responsesAreSame</a>
      </li>
    </ul>
  </li>
  <li>
    Strategies' plugins
    <ul class="list">
      <li>
        <a class="link" href="./serwist/runtime-caching/plugins/background-sync-plugin">BackgroundSyncPlugin</a>
      </li>
      <li>
        <a class="link" href="./serwist/runtime-caching/plugins/broadcast-update-plugin">BroadcastUpdatePlugin</a>
      </li>
      <li>
        <a class="link" href="./serwist/runtime-caching/plugins/cacheable-response-plugin">CacheableResponsePlugin</a>
      </li>
      <li>
        <a class="link" href="./serwist/runtime-caching/plugins/expiration-plugin">ExpirationPlugin</a>
      </li>
    </ul>
  </li>
</ul>
