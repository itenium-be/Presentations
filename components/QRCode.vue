<template>
  <div ref="container" class="qr-code" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { encode } from 'uqr'

const props = withDefaults(defineProps<{
  url: string
  color?: string
}>(), {
  color: '#343434',
})

const container = ref<HTMLElement>()

function render() {
  if (!container.value) return
  const qr = encode(props.url)
  const s = qr.size
  let rects = ''
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      if (qr.data[y][x]) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${props.color}"/>`
      }
    }
  }
  container.value.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" style="width:100%;height:100%">${rects}</svg>`
}

onMounted(render)
watch(() => props.url, render)
</script>

<style scoped>
.qr-code {
  width: 100%;
  height: 100%;
}
</style>
