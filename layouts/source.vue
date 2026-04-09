<template>
  <div class="slidev-layout source">
    <h1 class="source-title">Powerpoint Source</h1>
    <div class="source-qr">
      <QRCode :url="repoUrl" color="#343434" />
    </div>
    <a :href="repoUrl" class="source-link">github.com/{{ source }}</a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import QRCode from '../components/QRCode.vue'

const { $frontmatter } = useSlideContext()
const source = computed(() => $frontmatter?.source ?? 'itenium-be')
const repoUrl = computed(() => `https://github.com/${source.value}`)
</script>

<style scoped>
.source {
  position: relative;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 2.5rem 3rem;
  gap: 1.25rem;
}

.source-title {
  font-family: var(--font-heading);
  font-size: 2.4rem;
  color: var(--color-text-dark);
  margin: 0 0 0.5rem;
}

.source-qr {
  width: 16rem;
  height: 16rem;
}

.source-link {
  font-size: 1.25rem;
  color: var(--color-text-dark);
  text-decoration: none;
}
.source-link:hover {
  color: var(--color-primary);
}
</style>
