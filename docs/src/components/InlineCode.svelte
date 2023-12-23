<script lang="ts">
  import Code, { type CodeProps } from "./Code.svelte";

  const { ...props } = $props<CodeProps>();
</script>

<span class="inline-block">
  <Code {...props} />
</span>
