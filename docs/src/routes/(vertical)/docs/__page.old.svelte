<script>
  import ExternalLink from "$components/ExternalLink.svelte";
  import ICD from "$components/InlineCode.svelte";
  import { DOCS_SIDEBAR_LINKS } from "$lib/constants";
</script>

<h1 id="welcome">Welcome to Serwist!</h1>
<h2 id="introduction">Introduction</h2>
<p>
  Serwist is a collection of JavaScript libraries for
  <a href="https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps" target="_blank" rel="noreferrer" class="link">
    progressive web apps
  </a>. It is a fork of Workbox that came to be due to the its development being stagnated. Most of the prior work was done by Google LLC's team and
  the community.
</p>
<p>Take a look around:</p>
<ul class="list">
  {#each DOCS_SIDEBAR_LINKS.filter(e => e.title !== "Introduction") as { title, href }}
    <li>
      <ICD>
        <a class="link" {href}>{title}</a>
      </ICD>
    </li>
  {/each}
</ul>
<h2 id="alternatives">Alternatives</h2>
<p>There are also some alternatives to Serwist:</p>
<ul class="list">
  <li>
    <ExternalLink class="link" href="https://developer.chrome.com/docs/workbox">Workbox</ExternalLink>
  </li>
</ul>
