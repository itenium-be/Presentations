<template>
  <div class="slidev-layout quote">
    <img :src="dotsOrange" class="dots dots-left" aria-hidden="true" />
    <img :src="dotsOrange" class="dots dots-right" aria-hidden="true" />
    <div class="quote-line" />
    <div class="quote-content">
      <slot />
    </div>
    <IteniumLogo variant="icon" theme="dark" class="quote-logo" />
  </div>
</template>

<script setup>
const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href
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
  opacity: 0.4;
}
.dots-left {
  top: -5%;
  left: -3%;
  transform: rotate(45deg);
}
.dots-right {
  bottom: -5%;
  right: -3%;
  transform: rotate(-30deg);
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
