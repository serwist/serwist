<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";

  const { src, sizes, alt, class: className }: Pick<SvelteHTMLElements["enhanced:img"], "src" | "sizes" | "alt" | "class"> = $props();
</script>

<enhanced:img {src} {sizes} {alt} class={className}></enhanced:img>
