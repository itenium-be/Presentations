<script setup lang="ts">
</script>

<template>
  <a
    href="https://itenium-be.github.io/Presentations/"
    class="slidev-nav-back"
    title="Back to all talks"
  >
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
    All talks
  </a>
</template>

<style>
.slidev-nav-back {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: white;
  opacity: 0.6;
  transition: opacity 0.15s;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  text-decoration: none;
}
.slidev-nav-back:hover {
  opacity: 1;
}
</style>
