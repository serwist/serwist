<script>
  import { page } from "$app/stores";
  import Heading from "$components/Heading.svelte";
  import Navbar from "$components/layouts/Navbar.svelte";
</script>

<Navbar />
<main id="main-content">
  <div class="flex w-full items-center justify-center p-4">
    <div class="flex flex-col gap-4">
      <Heading type="title-large" aria-hidden="true">{":("}</Heading>
      <Heading type="display">A catastrophic error occurred.</Heading>
      <Heading type="title-large">Details: {$page.error?.message} ({$page.status})</Heading>
    </div>
  </div>
</main>
