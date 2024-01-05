<script setup lang="ts">
// @ts-check
const { $serwist } = useNuxtApp();
$serwist?.addEventListener("installed", () => {
  console.log("Serwist installed!");
})
// Doesn't work... yet.
void $serwist?.register({ immediate: true });
</script>
<template>
  <div>
    <h1>Nuxt + Serwist</h1>
  </div>
</template>
