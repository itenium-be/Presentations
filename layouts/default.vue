<template>
  <div class="slidev-layout default">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <img :src="dotsGreen" class="dots dots-green" aria-hidden="true" />
    <div ref="contentRef" class="content" :style="{ fontSize: contentFontSize }">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href
const dotsGreen = new URL('../assets/dots-green.png', import.meta.url).href

const contentRef = ref(null)
const contentFontSize = ref('1.1rem')

onMounted(async () => {
  await nextTick()
  const el = contentRef.value
  if (!el) return
  const items = el.querySelectorAll('li').length
  if (items <= 3) contentFontSize.value = '2.5rem'
  else if (items <= 5) contentFontSize.value = '2.2rem'
  else if (items <= 8) contentFontSize.value = '2rem'
  else contentFontSize.value = '1.8rem'
})
</script>

<style scoped>
.default {
  position: relative;
  overflow: hidden;
  background: white;
  color: var(--color-text-dark);
  height: 100%;
}

.dots {
  position: absolute;
  pointer-events: none;
  height: 55%;
  width: auto;
  opacity: 0.6;
}
.dots-orange {
  top: 15%;
  left: -50px;
  transform: scaleX(-1);
}
.dots-green {
  top: -10%;
  right: -3%;
  transform: rotate(-30deg);
}

.content {
  position: relative;
  z-index: 1;
  padding: 2rem 2.5rem 3rem 6rem;
  height: 100%;
  box-sizing: border-box;
}
.content :deep(h1) {
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-dark);
}
.content :deep(h2) {
  font-size: 1.2rem;
  color: var(--color-text-dark);
  font-weight: normal;
  font-style: italic;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
}
.content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}
.content :deep(ul ul) {
  list-style-type: circle;
}
.content :deep(li) {
  margin-bottom: 0.25rem;
}

</style>
