<template>
  <div class="slidev-layout section">
    <img :src="sectionBg" class="section-bg" aria-hidden="true" />
    <div class="section-overlay" />
    <div class="section-content">
      <div class="section-line" />
      <slot name="default" />
    </div>
    <div class="section-bottom">
      <div class="section-subtitle" v-if="$slots.subtitle">
        <slot name="subtitle" />
      </div>
      <IteniumLogo variant="full" theme="dark" class="section-logo" />
    </div>
  </div>
</template>

<script setup>
const sectionBg = new URL('../assets/section-bg.jpg', import.meta.url).href
</script>

<style scoped>
.section {
  position: relative;
  overflow: hidden;
  height: 100%;
}

.section-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
}

.section-content {
  position: relative;
  z-index: 1;
  padding: 4rem 4rem 0;
}

.section-line {
  width: 80%;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
  margin-bottom: 1.5rem;
}

.section-content :deep(h1) {
  font-size: 3rem;
  color: #fff;
  margin: 0;
}

.section-content :deep(p),
.section-content :deep(div) {
  color: rgba(255, 255, 255, 0.85);
}

.section-bottom {
  position: absolute;
  bottom: 1.5rem;
  left: 4rem;
  right: 1.5rem;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
}

.section-logo {
  height: 30px !important;
}
</style>
