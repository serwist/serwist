<script lang="ts">
  import MoonStars from "$components/icons/MoonStars.svelte";
  import Sun from "$components/icons/Sun.svelte";
  import { toggleColorScheme } from "$lib/stores/colorScheme";
</script>

<button class="nav-button" on:click={() => toggleColorScheme()}>
  <span class="visible-dark">
    <MoonStars width={24} height={24} />
  </span>
  <span class="visible-light">
    <Sun width={24} height={24} />
  </span>
  <p class="sr-only">Toggle color scheme</p>
</button>
