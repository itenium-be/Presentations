<template>
  <div class="slidev-layout quote-image">
    <img :src="dotsUrl" class="dots" aria-hidden="true" />
    <div class="qi-content">
      <div class="qi-title">
        <slot />
      </div>
      <div class="qi-image" v-if="$slots.image">
        <slot name="image" />
      </div>
      <div class="qi-author" v-if="$slots.author">
        <slot name="author" />
      </div>
    </div>
  </div>
</template>

<script setup>
const dotsUrl = new URL('../assets/dots-green.png', import.meta.url).href
</script>

<style scoped>
.quote-image {
  position: relative;
  overflow: hidden;
  height: 100%;
  background-color: #6fbda5;
  display: flex;
  align-items: center;
  justify-content: center;
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

.qi-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.5rem;
}

.qi-title :deep(h1) {
  font-size: 2.4rem;
  color: white;
  text-align: center;
  margin: 0;
  flex-shrink: 0;
}

.qi-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 0;
  width: 100%;
}

.qi-image :deep(img) {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.qi-author {
  margin-top: 1.5rem;
  text-align: center;
}

.qi-author :deep(strong) {
  display: block;
  font-size: 1rem;
  color: #2D2A28;
}

.qi-author :deep(p) {
  margin: 0;
  font-size: 0.9rem;
  color: #2D2A28;
  line-height: 1.5;
}
</style>
