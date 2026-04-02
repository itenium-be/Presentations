<template>
  <div class="slidev-layout code-layout">
    <div class="content">
      <slot />
    </div>
    <TitleDecoration :frontmatter="$frontmatter" />
  </div>
</template>

<style scoped>
.code-layout {
  position: relative;
  overflow: hidden;
  background: white;
  color: var(--color-text-dark);
  height: 100%;
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
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.content :deep(.slidev-code) {
  font-size: 0.58em !important;
  line-height: 1.35;
}

.content :deep(.shiki) {
  padding: 0.75rem 1rem;
}
</style>
