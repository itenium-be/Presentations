<template>
  <div class="slidev-layout quote-alt">
    <img :src="dotsUrl" class="dots" aria-hidden="true" />
    <div class="quote-content">
      <svg class="quote-icon" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M0 40V24.8C0 20.27 0.83 16.13 2.5 12.4C4.17 8.53 6.83 4.93 10.5 1.6L17.5 6.4C15.17 8.93 13.33 11.53 12 14.2C10.67 16.87 9.83 19.8 9.5 23H20V40H0ZM30 40V24.8C30 20.27 30.83 16.13 32.5 12.4C34.17 8.53 36.83 4.93 40.5 1.6L47.5 6.4C45.17 8.93 43.33 11.53 42 14.2C40.67 16.87 39.83 19.8 39.5 23H50V40H30Z" fill="white"/>
      </svg>
      <div class="quote-text">
        <slot />
      </div>
      <div class="quote-attribution">
        <slot name="author" />
      </div>
      <div class="quote-line"></div>
    </div>
  </div>
</template>

<script setup>
const dotsUrl = new URL('../assets/dots-green.png', import.meta.url).href
</script>

<style scoped>
.quote-alt {
  position: relative;
  overflow: hidden;
  height: 100%;
  background-color: #6fbda5;
  display: flex;
  align-items: center;
}

.dots {
  position: absolute;
  top: -70px;
  right: -30px;
  height: 45%;
  width: auto;
  opacity: 0.3;
  filter: brightness(10);
  transform: scaleX(1.5);
  transform-origin: right top;
  pointer-events: none;
}

.quote-content {
  padding: 3rem 6rem;
  max-width: 90%;
}

.quote-icon {
  width: 55px;
  height: auto;
  margin-bottom: 2rem;
}

.quote-text :deep(p),
.quote-text :deep(blockquote p) {
  font-size: 1.8rem;
  line-height: 1.6;
  color: #2D2A28;
  margin: 0 0 2rem 0;
}

.quote-text :deep(blockquote) {
  margin: 0;
  padding: 0;
  border: none;
}

.quote-attribution :deep(strong) {
  display: block;
  font-size: 1rem;
  color: #2D2A28;
}

.quote-attribution :deep(p) {
  margin: 0;
  font-size: 0.9rem;
  color: #2D2A28;
  line-height: 1.5;
}

.quote-line {
  width: 200px;
  height: 2px;
  background: #2D2A28;
  margin-top: 1rem;
}
</style>
