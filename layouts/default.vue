<template>
  <div class="slidev-layout default">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <img :src="dotsGreen" class="dots dots-green" aria-hidden="true" />
    <div class="content">
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
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-dark);
}
.content :deep(h2) {
  font-size: 1.2rem;
  color: var(--color-text-dark);
  font-weight: normal;
  font-style: italic;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
}

</style>
