<template>
  <div class="slidev-layout default">
    <slot />
    <SlideFooter />
  </div>
</template>

<style scoped>
.default {
  position: relative;
  padding: 2rem 2.5rem 3.5rem;
  background: white;
  color: var(--color-text-dark);
}
.default :deep(h1) {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--color-bg);
  border-bottom: 3px solid var(--color-primary);
  padding-bottom: 0.4rem;
  display: inline-block;
}
.default :deep(h2) {
  font-size: 1.3rem;
  color: var(--color-bg);
}
</style>
