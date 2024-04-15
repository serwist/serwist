<script>
  import CodeTab from "$components/CodeTab.svelte";
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="abstractions">Using the Serwist API</h1>
<h2 id="introduction">Introduction</h2>
<p>
  "A progressive web app (PWA) is an app that's built using web platform technologies, but that provides a user experience like that of a
  platform-specific app. Like a website, a PWA can run on multiple platforms and devices from a single codebase. Like a platform-specific app, it can
  be installed on the device, can operate while offline and in the background, and can integrate with the device and with other installed apps" - MDN
  Web Docs (<ExternalLink class="link" href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps">source</ExternalLink>)
</p>
<p>
  A service worker is what give a PWA features found in platform-specific apps, such as pushing notifications, operating without network connectivity,
  deferring tasks when users are offline, etc. (more on <ExternalLink class="link" href="https://whatpwacando.today">
    What PWA Can Do Today
  </ExternalLink>). The native Service Worker API, unfortunately, requires developers to spend much effort to get started and maintain, and that is
  where Serwist shines: it makes creating service workers a breeze for everyone, with it requiring as few as ten lines of code to initialize a project
  and still being efficient.
</p>
<h2 id="basic-usage">Basic usage</h2>
<p>To get started with Serwist, you only need as much code as the following snippet:</p>
<CodeTab codes={data.code.basicUsage.setup} defaultTab="sw.ts" />
<h3 id="customizing-the-behaviour">Customizing the behaviour</h3>
<p>
  However, in most cases, the defaults probably do not suit you. For example, you may want Serwist to precache some URLs, sometimes concurrently as
  well; clean up outdated caches; or claim all available clients on activation. The <ICD>Serwist</ICD> class provides
  <a class="link" href="./core/serwist#parameters">a set of options for you to configure its behaviour</a>.
</p>
<CodeTab codes={data.code.basicUsage.customizing} defaultTab="sw.ts" />
<h2 id="advanced-usage">Advanced usage</h2>
<h3 id="interoperability">Interoperating with the Service Worker API</h3>
<p>The Serwist API is designed so that you can use it with the native API anytime you want. For example, to add your own event listeners:</p>
<CodeTab codes={data.code.advancedUsage.listeners} defaultTab="sw.ts" />
<h3 id="dynamic-register">Dynamically registering a Route</h3>
<p>You can also dynamically register a Route after initializing <ICD>Serwist</ICD>:</p>
<CodeTab codes={data.code.advancedUsage.dynamicRegisterRoute} defaultTab="sw.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about the core of Serwist:</p>
<ul class="list">
  <li>
    <a class="link" href="./background-syncing">Background synchronizing</a>
  </li>
  <li>
    <a class="link" href="./broadcasting-updates">Broadcasting cache updates</a>
  </li>
  <li>
    <a class="link" href="./expiring-outdated-responses">Expiring outdated responses</a>
  </li>
  <li>
    <a class="link" href="./navigation-preloading">Preloading navigations</a>
  </li>
  <li>
    <a class="link" href="./precaching">Precaching assets</a>
  </li>
  <li>
    <a class="link" href="./setting-cacheability-criteria">Setting cacheability criteria</a>
  </li>
</ul>
