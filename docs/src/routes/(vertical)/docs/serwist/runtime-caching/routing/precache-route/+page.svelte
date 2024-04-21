<script lang="ts">
  import CodeTab from "$components/CodeTab.svelte";
  import ICD from "$components/InlineCode.svelte";

  const { data } = $props();
</script>

<h1 id="precache-route">PrecacheRoute</h1>
<h2 id="first-added">First added</h2>
<p>Workbox</p>
<h2 id="about">About</h2>
<p>
  A subclass of <ICD>Route</ICD> that takes a <ICD>Serwist</ICD> instance and uses it to match incoming requests and handle fetching responses from the
  precache.
</p>
<h2 id="parameters">Parameters</h2>
<ul class="list">
  <li>
    <ICD>serwist</ICD> — A <ICD>Serwist</ICD> instance used to both match requests and respond to fetch events.
  </li>
  <li>
    <ICD>options</ICD> — Options to control how requests are matched against the list of precached URLs:
    <ul class="list">
      <li>
        <ICD>directoryIndex</ICD> — Tells Serwist to check the precache for an entry whose URL is the request URL appended with the specified value. Only
        applies if the request URL ends with "/".
      </li>
      <li>
        <ICD>ignoreURLParametersMatching</ICD> — An array of <ICD>RegExp</ICD> objects matching search params that should be removed when looking * for
        a precache match.
      </li>
      <li>
        <ICD>cleanURLs</ICD> — Tells Serwist to check the precache for an entry whose URL is the request URL appended with ".html".
      </li>
      <li>
        <ICD>urlManipulation</ICD> — A function that should take a URL and return an array of alternative URLs that should be checked for precache matches.
      </li>
    </ul>
  </li>
</ul>
<h2 id="usage">Usage</h2>
<CodeTab codes={data.code.usage} defaultTab="sw.ts" />
<h2 id="more-resources">More resources</h2>
<p>Here is a list of resources you can read to learn more about <ICD>PrecacheRoute</ICD>:</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/guide/precaching">Serwist's blog on precaching assets</a>
  </li>
</ul>
