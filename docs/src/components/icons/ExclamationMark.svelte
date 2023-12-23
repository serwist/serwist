<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";

  const { ...props } = $props<SVGAttributes<SVGElement>>();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={2}
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  {...props}
>
  <path d="M12 19v.01" />
  <path d="M12 15v-10" />
</svg>
