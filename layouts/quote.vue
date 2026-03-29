<template>
  <div class="slidev-layout quote">
    <img :src="dotsOrange" class="dots dots-left" aria-hidden="true" />
    <img :src="dotsOrange" class="dots dots-right" aria-hidden="true" />
    <div class="quote-line" />
    <div class="quote-content">
      <slot />
    </div>
    <img :src="faviconUrl" class="quote-logo" alt="" />
  </div>
</template>

<script setup>
const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href
const faviconUrl = new URL('../assets/favicon-white.png', import.meta.url).href
</script>

<style scoped>
.quote {
  position: relative;
  overflow: hidden;
  height: 100%;
  background-color: #E78200;
}

.dots {
  position: absolute;
  pointer-events: none;
  height: 40%;
  width: auto;
}
.dots-left {
  top: -70px;
  right: calc(100% - 120px);
  transform: scaleX(-1.5);
  opacity: 0.4;
  filter: brightness(10);
}
.dots-right {
  bottom: -70px;
  right: 0;
  opacity: 0.4;
  filter: brightness(0.3);
  transform: scaleX(1.5);
  transform-origin: right bottom;
}

.quote-line {
  position: absolute;
  bottom: 35%;
  left: 15%;
  right: 15%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.quote-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 3rem 6rem;
  text-align: center;
}

.quote-content :deep(h1) {
  font-size: 2.8rem;
  color: #fff;
  margin: 0;
}

.quote-content :deep(p) {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.2rem;
}

.quote-logo {
  position: absolute;
  bottom: 1rem;
  right: 1.5rem;
  height: 28px !important;
}
</style>
