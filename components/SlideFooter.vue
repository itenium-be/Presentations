<template>
  <div class="slide-footer">
    <IteniumLogo variant="icon" :theme="theme" class="footer-logo" />
    <span class="footer-page">{{ $slidev?.nav?.currentPage }} / {{ $slidev?.nav?.total }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light',
})
</script>

<style scoped>
.slide-footer {
  position: absolute;
  bottom: 1.25rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: 0.7;
}
.footer-logo {
  height: 28px !important;
}
.footer-page {
  font-size: 0.75rem;
  font-family: var(--font-body);
  color: var(--color-text-muted);
}
</style>
