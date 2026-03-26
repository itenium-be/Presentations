<template>
  <img
    :src="src"
    :alt="'itenium logo'"
    :class="['itenium-logo', `itenium-logo--${variant}`, `itenium-logo--${theme}`]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'icon' | 'full'
  theme?: 'light' | 'dark'
}>(), {
  variant: 'full',
  theme: 'dark',
})

const src = computed(() => {
  const color = props.theme === 'dark' ? 'white' : 'gray'
  return new URL(`../assets/logo-${props.variant}-${color}.svg`, import.meta.url).href
})
</script>

<style scoped>
.itenium-logo--icon {
  height: 40px;
  width: auto;
}
.itenium-logo--full {
  height: 50px;
  width: auto;
}
</style>
