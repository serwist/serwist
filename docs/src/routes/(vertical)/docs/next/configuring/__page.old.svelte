<script>
  import ICD from "$components/InlineCode.svelte";
  import { DOCS_NEXT_OPTIONS } from "$lib/constants";
</script>

<h1 id="configuring">Configuring</h1>
<h2 id="available-options">Available options</h2>
<p>There are various options you can use to customize the behaviour of the plugin:</p>
<ul class="list">
  {#each DOCS_NEXT_OPTIONS as { title, href }}
    <li>
      <ICD>
        <a class="link" {href}>{title}</a>
      </ICD>
    </li>
  {/each}
</ul>
