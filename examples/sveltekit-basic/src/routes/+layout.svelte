<script lang="ts">
  import { useSerwist } from "@serwist/svelte/client";
  import { dev } from "$app/environment";

  let { children } = $props();

  const { serwist } = useSerwist("/service-worker.js", { type: dev ? "module" : "classic" });

  $effect(() => {
    // If you are developing using browsers that do not support ESM in service workers,
    // change this to `if (!dev && serwist)`.
    if (serwist) {
      serwist.addEventListener("installed", () => {
        console.log("Serwist installed!");
      });
      void serwist.register();
    }
  });
</script>

{@render children()}
