<template>
  <div class="slidev-layout code-layout">
    <img :src="dotsGreen" class="dots dots-green" aria-hidden="true" />
    <div class="content" :style="$frontmatter?.['code-size'] ? { '--code-size': $frontmatter['code-size'] } : {}">
      <slot />
    </div>
    <TitleDecoration :frontmatter="$frontmatter" />
    <SlideFooter />
  </div>
</template>

<script setup>
const dotsGreen = new URL('../assets/dots-green.png', import.meta.url).href
</script>

<style scoped>
.code-layout {
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
.dots-green {
  bottom: -15%;
  left: -3%;
  transform: rotate(150deg);
}

.content {
  position: relative;
  z-index: 1;
  padding: 0.25rem 2rem 0.25rem 2.5rem;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.content :deep(h1) {
  font-size: 2.4rem;
  margin: 0 0 0.25rem 0;
  color: var(--color-text-dark);
  flex-shrink: 0;
}
.content :deep(h2) {
  font-size: 1.5rem;
  color: var(--color-text-dark);
  font-weight: normal;
  font-style: italic;
  margin-top: 0.1rem;
  margin-bottom: 0.25rem;
  flex-shrink: 0;
}

.content :deep(.slidev-code-wrapper),
.content :deep(div[class*="language-"]) {
  overflow: auto;
}

.content :deep(.slidev-code),
.content :deep(.slidev-code) .line,
.content :deep(.shiki) code,
.content :deep(pre code) {
  font-size: var(--code-size, 1em) !important;
  line-height: 1.6 !important;
}

.content :deep(.shiki) {
  padding: 0.75rem 1rem;
}
</style>
