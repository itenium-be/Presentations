<template>
  <div class="slidev-layout two-cols-code">
    <div class="col col-left">
      <slot name="default" />
    </div>
    <div class="col col-right">
      <slot name="right" />
    </div>
    <SlideFooter />
  </div>
</template>

<style scoped>
.two-cols-code {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1.5rem 2rem 3.5rem;
  background: white;
  align-items: start;
}
.col {
  height: 100%;
}
.col-right {
  padding-left: 1rem;
  border-left: 2px solid var(--color-primary);
}
</style>
