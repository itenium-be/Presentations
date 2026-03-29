<template>
  <div class="slidev-layout cover">
    <div class="cover-dots" aria-hidden="true">
      <img :src="dotsUrl" alt="" />
    </div>
    <div class="cover-image" v-if="$frontmatter?.image">
      <img :src="$frontmatter.image" alt="" />
    </div>
    <IteniumLogo variant="full" theme="dark" class="cover-logo" />
    <div class="cover-content">
      <div class="cover-spacer" />
      <div class="cover-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const dotsUrl = new URL('../assets/cover-dots.png', import.meta.url).href
</script>

<style scoped>
.cover {
  position: relative;
  overflow: hidden;
  background-color: #E78200;
  width: 100%;
  height: 100%;
}

.cover-dots {
  position: absolute;
  top: -10%;
  right: -5%;
  height: 120%;
  pointer-events: none;
  opacity: 0.3;
  transform: rotate(-30deg);
}
.cover-dots img {
  height: 100%;
  width: auto;
}

.cover-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 38%;
  height: 100%;
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
}
.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2rem 0 2rem 0;
}

.cover-logo {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  height: 240px !important;
}

.cover-spacer {
  flex: 1;
}

.cover-body {
  max-width: 55%;
  color: #fff;
}

.cover-body :deep(h1) {
  font-size: 3rem;
  line-height: 1.15;
  color: #fff;
  margin: 0;
}

.cover-body :deep(h2) {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: normal;
}
</style>
