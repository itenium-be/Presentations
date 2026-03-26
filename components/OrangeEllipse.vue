<template>
  <div :class="['orange-ellipse', `orange-ellipse--${side}`]" aria-hidden="true">
    <img :src="src" alt="" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  side?: 'left' | 'right'
}>(), {
  side: 'right',
})

const src = new URL('../assets/orange-ellipse.svg', import.meta.url).href
</script>

<style scoped>
.orange-ellipse {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  height: 100%;
  display: flex;
  align-items: center;
}
.orange-ellipse img {
  height: 90%;
  width: auto;
}
.orange-ellipse--right {
  right: -20px;
}
.orange-ellipse--left {
  left: -20px;
  transform: translateY(-50%) scaleX(-1);
}
</style>
