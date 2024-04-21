<script>
  import Navbar from "$components/layouts/Navbar.svelte";

  const { children } = $props();
</script>

<Navbar />
<main id="main-content">
  {@render children()}
</main>
