<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNav } from '@slidev/client'

const { currentSlideNo } = useNav()
const visible = ref(false)
const dismissed = ref(false)

onMounted(() => {
  if (currentSlideNo.value === 1) {
    visible.value = true
    setTimeout(() => { visible.value = false }, 6000)
  }
})

function dismiss() {
  visible.value = false
  dismissed.value = true
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible && !dismissed" class="nav-hint" @click="dismiss">
      <span>Use <kbd>&larr;</kbd> <kbd>&rarr;</kbd> arrow keys to navigate</span>
      <span class="nav-hint-sep">&middot;</span>
      <span>Hover bottom-left for controls</span>
    </div>
  </Transition>
</template>

<style>
.nav-hint {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8rem;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  z-index: 100;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(4px);
  white-space: nowrap;
}
.nav-hint kbd {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 3px;
  padding: 0 0.3rem;
  font-family: inherit;
  font-size: 0.85em;
}
.nav-hint-sep {
  opacity: 0.4;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
