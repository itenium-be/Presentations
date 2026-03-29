<template>
  <img :src="src" :alt="'itenium logo'" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const src = computed(() => {
  return new URL(`../assets/itenium-logo.png`, import.meta.url).href
})
</script>
