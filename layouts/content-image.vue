<template>
  <div class="slidev-layout content-image">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <div class="ci-left">
      <slot name="default" />
    </div>
    <div class="ci-right" :class="'fit-' + ($frontmatter?.['image-fit'] ?? 'contain')" v-if="$slots.image">
      <slot name="image" />
    </div>
    <SlideFooter />
  </div>
</template>

<script setup>
const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href
</script>

<style scoped>
.content-image {
  position: relative;
  overflow: hidden;
  height: 100%;
  background: white;
  display: grid;
  grid-template-columns: 1fr 38%;
}

.dots {
  position: absolute;
  pointer-events: none;
  height: 55%;
  width: auto;
  opacity: 0.6;
}
.dots-orange {
  bottom: -15%;
  left: -50px;
  transform: scaleX(-1);
}

.ci-left {
  position: relative;
  z-index: 1;
  padding: 2rem 2.5rem 3rem;
  overflow: auto;
}

.ci-left :deep(h1) {
  font-size: 1.8rem;
  color: var(--color-text-dark);
  margin-bottom: 0.5rem;
}
.ci-left :deep(h2) {
  font-size: 1.2rem;
  color: var(--color-text-dark);
  font-weight: normal;
  font-style: italic;
  margin-top: -0.3rem;
  margin-bottom: 0.75rem;
}
.ci-left {
  font-size: 1.8rem;
}
.ci-left :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}
.ci-left :deep(ul ul) {
  list-style-type: circle;
  font-size: 0.85em;
}
.ci-left :deep(li) {
  margin-bottom: 0.25rem;
}

.ci-right {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 1.5rem;
}
.ci-right :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.ci-right.fit-cover {
  padding: 0;
}
.ci-right.fit-cover :deep(img) {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: cover;
}
.ci-right.fit-fill {
  padding: 0;
}
.ci-right.fit-fill :deep(img) {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: contain;
}

</style>
