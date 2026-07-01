<template>
  <div ref="container" class="qr-code" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { encode } from 'uqr'
import logoUrl from '../assets/favicon.png'

const props = withDefaults(defineProps<{
  url: string
  color?: string
}>(), {
  color: '#343434',
})

const container = ref<HTMLElement>()

function render() {
  if (!container.value) return
  // ecc 'H' (~30% recovery) is what makes the centered logo overlay stay scannable.
  const qr = encode(props.url, { ecc: 'H' })
  const s = qr.size
  let rects = ''
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      if (qr.data[y][x]) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${props.color}"/>`
      }
    }
  }
  // Logo kept to ~24% width so the covered area stays within ecc 'H' recovery budget.
  const logo = s * 0.24
  const pad = s * 0.03
  const box = logo + pad * 2
  const overlay =
    `<rect x="${(s - box) / 2}" y="${(s - box) / 2}" width="${box}" height="${box}" rx="${box * 0.15}" fill="#fff"/>` +
    `<image href="${logoUrl}" x="${(s - logo) / 2}" y="${(s - logo) / 2}" width="${logo}" height="${logo}"/>`
  container.value.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" style="width:100%;height:100%">${rects}${overlay}</svg>`
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
