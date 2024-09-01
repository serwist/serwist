<script>
  import ICD from "$components/InlineCode.svelte";
  import { DOCS_CORE_FUNCTIONS, DOCS_CORE_GUIDE, DOCS_CORE_PLUGINS, DOCS_CORE_ROUTING, DOCS_CORE_STRATEGIES } from "$lib/constants";
</script>

<h1 id="serwist">serwist</h1>
<h2 id="introduction">Introduction</h2>
<p>
  <ICD>serwist</ICD> is the core of Serwist. It contains tools designed to help you write service workers with ease. Have a look around:
</p>
<ul class="list">
  <li>
    <a class="link" href="/docs/serwist/core">Using the Serwist API</a>
  </li>
  {#each DOCS_CORE_GUIDE as { title, href }}
    <li>
      <a class="link" {href}>{title}</a>
    </li>
  {/each}
</ul>
<h2 id="api">The Serwist API</h2>
<p>Here lists those which <ICD>serwist</ICD> offers:</p>
<ul class="list">
  <li>
    Core functions
    <ul class="list">
      {#each DOCS_CORE_FUNCTIONS as { title, href }}
        <li>
          <a class="link" {href}>{title}</a>
        </li>
      {/each}
    </ul>
  </li>
  <li>
    Caching strategies
    <ul class="list">
      {#each DOCS_CORE_STRATEGIES as { title, href }}
        <li>
          <a class="link" {href}>{title}</a>
        </li>
      {/each}
    </ul>
  </li>
  <li>
    Routing
    <ul class="list">
      {#each DOCS_CORE_ROUTING as { title, href }}
        <li>
          <a class="link" {href}>{title}</a>
        </li>
      {/each}
    </ul>
  </li>
  <li>
    Plugins for caching strategies
    <ul class="list">
      {#each DOCS_CORE_PLUGINS as { title, href }}
        <li>
          <a class="link" {href}>{title}</a>
        </li>
      {/each}
    </ul>
  </li>
</ul>
