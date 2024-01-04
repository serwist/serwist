<script>
  import { page } from "$app/stores";
  import Navbar from "$components/layouts/Navbar.svelte";
</script>

<Navbar />
<main id="main-content">
  <div class="flex w-full items-center justify-center p-4">
    <div class="flex flex-col gap-4">
      <h2>{":("}</h2>
      <h1>A catastrophic error occurred.</h1>
      <h2>Details: {$page.error?.message} ({$page.status})</h2>
    </div>
  </div>
</main>
