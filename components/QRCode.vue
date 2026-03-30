<template>
  <svg :viewBox="`0 0 ${size} ${size}`" class="qr-code">
    <rect v-for="(mod, i) in modules" :key="i"
      :x="mod.x" :y="mod.y" width="1" height="1"
      :fill="color"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { encode } from 'uqr'

const props = withDefaults(defineProps<{
  url: string
  color?: string
}>(), {
  color: '#ffffff',
})

const qr = computed(() => encode(props.url))
const size = computed(() => qr.value.size)
const modules = computed(() => {
  const mods: { x: number; y: number }[] = []
  const data = qr.value.data
  for (let y = 0; y < size.value; y++) {
    for (let x = 0; x < size.value; x++) {
      if (data[y * size.value + x]) {
        mods.push({ x, y })
      }
    }
  }
  return mods
})
</script>

<style scoped>
.qr-code {
  width: 100%;
  height: 100%;
}
</style>
