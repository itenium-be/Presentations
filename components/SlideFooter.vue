<template>
  <div class="slide-footer">
    <span class="footer-page">{{ $slidev?.nav?.currentPage }}</span>
    <img :src="faviconUrl" class="footer-favicon" alt="" />
  </div>
</template>

<script setup>
const faviconUrl = new URL('../assets/favicon.png', import.meta.url).href
</script>

<style scoped>
.slide-footer {
  position: absolute;
  bottom: 0.75rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  z-index: 2;
}
.footer-page {
  font-weight: bold;
}
.footer-favicon {
  margin-left: auto;
  height: 24px;
  width: auto;
}
</style>
