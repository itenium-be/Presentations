<template>
  <div class="slidev-layout content-image">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <div class="ci-left">
      <slot />
    </div>
    <div class="ci-right" v-if="$frontmatter?.image">
      <img :src="$frontmatter.image" alt="" />
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
  height: 50%;
  width: auto;
  opacity: 0.5;
}
.dots-orange {
  bottom: -10%;
  left: -3%;
  transform: rotate(45deg);
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

.ci-right {
  position: relative;
  overflow: hidden;
}
.ci-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
