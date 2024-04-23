<script>
  import { DOCS_CORE_GUIDE } from "$lib/constants";
</script>

<h1 id="guide">Diving deeper</h1>
<h2 id="introduction">Introduction</h2>
<p>To help you with using Serwist, we provide the following blogs:</p>
<ul class="list">
  {#each DOCS_CORE_GUIDE as { title, href }}
    <li>
      <a class="link" {href}>{title}</a>
    </li>
  {/each}
</ul>
