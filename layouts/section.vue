<template>
  <div class="slidev-layout section dark">
    <OrangeEllipse side="right" />
    <div class="section-content">
      <div class="section-accent" />
      <h1 class="section-title">
        <slot />
      </h1>
    </div>
    <SlideFooter theme="dark" />
  </div>
</template>

<style scoped>
.section {
  position: relative;
  overflow: hidden;
}
.section-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 100%;
  padding: 2.5rem 3rem;
  padding-right: 240px;
}
.section-accent {
  width: 6px;
  height: 80px;
  background-color: var(--color-primary);
  border-radius: 3px;
  flex-shrink: 0;
}
.section-title {
  font-size: 2.2rem;
  color: var(--color-text);
  margin: 0;
}
</style>
