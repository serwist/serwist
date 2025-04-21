---
"vite-plugin-serwist": minor
---

feat(vite): introduce framework-specific hooks

- `useSerwist` is a new hook used for accessing the Serwist instance. It can be imported from `virtual:serwist/preact` for Preact (≥ 10.0.0), `virtual:serwist/react` for React (≥ 18.0.0), `virtual:serwist/solid` for Solid (≥ 1.0.0), `virtual:serwist.svelte` for Svelte (≥ 5.0.0), `virtual:serwist/vue` for Vue (≥ 3.0.0). For example:

  For React:

  ```tsx
  import { useSerwist } from "virtual:serwist/react"; 

  const Component = () => {
    const serwist = useSerwist();
    useEffect(() => {
      if (!serwist) return;
      serwist.addEventListener("installed", () => {
        console.log("Serwist installed!");
      });
      void serwist.register();
    }, [serwist]);
    return <p>Hello world!</p>;
  }
  ```

  or for Svelte:

  ```svelte
  <script lang="ts">
    // Must be in Runes mode!
    import { useSerwist } from "virtual:serwist.svelte";

    const serwist = useSerwist();

    $effect(() => {
      if (!serwist) return;
      serwist.addEventListener("installed", () => {
        console.log("Serwist installed!");
      });
      void serwist.register();
    });
  </script>

  <p>Hello world!</p>
  ```