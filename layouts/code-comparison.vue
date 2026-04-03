<template>
  <div class="slidev-layout code-comparison">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <img :src="dotsGreen" class="dots dots-green" aria-hidden="true" />
    <div class="comparison-content" :style="$frontmatter?.['code-size'] ? { '--code-size': $frontmatter['code-size'] } : {}">
      <slot name="title">
        <h1 v-if="$slots.default"><slot /></h1>
      </slot>
      <div class="cols">
        <div class="col col-before">
          <h3>{{ $frontmatter?.['before-label'] || 'Before' }}</h3>
          <slot name="before" />
        </div>
        <div class="col col-after">
          <h3>{{ $frontmatter?.['after-label'] || 'After' }}</h3>
          <slot name="after" />
        </div>
      </div>
    </div>
    <TitleDecoration :frontmatter="$frontmatter" />
    <SlideFooter />
  </div>
</template>

<script setup>
const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href
const dotsGreen = new URL('../assets/dots-green.png', import.meta.url).href
</script>

<style scoped>
.code-comparison {
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
  padding: 1.5rem 2.5rem 2rem;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.comparison-content :deep(h1) {
  font-size: 2.2rem;
  color: var(--color-text-dark);
  margin-bottom: 0.25rem;
  flex-shrink: 0;
}

.comparison-content :deep(h2) {
  font-size: 1.5rem;
  color: var(--color-text-dark);
  font-weight: normal;
  font-style: italic;
  margin-top: 0.1rem;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

.col {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.col h3 {
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  flex-shrink: 0;
}

.col-before h3 {
  color: #dc2626;
}

.col-after h3 {
  color: #16a34a;
}

.col :deep(.slidev-code-wrapper),
.col :deep(div[class*="language-"]) {
  flex: 1;
  overflow: auto;
  margin: 0;
}

.col :deep(.slidev-code),
.col :deep(.slidev-code) .line,
.col :deep(.shiki) code,
.col :deep(pre code) {
  font-size: var(--code-size, 0.85em) !important;
  line-height: 1.5 !important;
}

.col :deep(.shiki) {
  padding: 0.5rem 0.75rem;
  margin: 0;
  height: 100%;
  box-sizing: border-box;
}

.col :deep(pre) {
  margin: 0;
}
</style>
