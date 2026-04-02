<template>
  <div class="slidev-layout comparison">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <img :src="dotsGreen" class="dots dots-green" aria-hidden="true" />
    <div class="comparison-content">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<script setup>
const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href
const dotsGreen = new URL('../assets/dots-green.png', import.meta.url).href
</script>

<style scoped>
.comparison {
  position: relative;
  overflow: hidden;
  height: 100%;
  background: #f5f5f5;
}

.dots {
  position: absolute;
  pointer-events: none;
  height: 45%;
  width: auto;
  opacity: 0.5;
}
.dots-orange {
  top: -5%;
  left: -3%;
  transform: rotate(45deg) scaleX(-1);
}
.dots-green {
  top: -10%;
  right: -3%;
  transform: rotate(-30deg);
}

.comparison-content {
  position: relative;
  z-index: 1;
  padding: 2rem 2.5rem 3rem;
  height: 100%;
  box-sizing: border-box;
}

.comparison-content :deep(h1) {
  font-size: 2.4rem;
  color: var(--color-text-dark);
  margin-bottom: 0;
}
.comparison-content :deep(h2) {
  font-size: 1.5rem;
  color: var(--color-text-dark);
  font-weight: normal;
  font-style: italic;
  margin-top: 0.1rem;
  margin-bottom: 1rem;
}

.comparison-content :deep(.cols) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  height: calc(100% - 4rem);
}

.comparison-content :deep(.col) {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.comparison-content :deep(.col h3) {
  color: #E78200;
  font-size: 1.6rem;
  margin-bottom: 0.75rem;
}

.comparison-content :deep(.col) {
  font-size: 1.3rem;
}

.comparison-content :deep(.col ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.comparison-content :deep(.col li) {
  margin-bottom: 0.3rem;
}

</style>
