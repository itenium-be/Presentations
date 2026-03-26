<template>
  <div class="slidev-layout demo">
    <div v-if="$frontmatter?.demoTitle" class="demo-header">
      <h2>{{ $frontmatter.demoTitle }}</h2>
    </div>
    <div class="demo-body">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.demo {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 0 0 3rem;
}
.demo-header {
  padding: 0.75rem 1.5rem;
  background: var(--color-bg);
  border-bottom: 2px solid var(--color-primary);
}
.demo-header h2 {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text);
  font-family: var(--font-heading);
}
.demo-body {
  flex: 1;
  overflow: hidden;
}
.demo-body :deep(.slidev-code) {
  height: 100%;
  font-size: 0.9em;
}
</style>
