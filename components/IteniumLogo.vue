<template>
  <img :src="src" :alt="'itenium logo'" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const src = computed(() => {
  return new URL(`../assets/logo-full-white.svg`, import.meta.url).href
})
</script>
