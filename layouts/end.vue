<template>
  <div class="slidev-layout end">
    <img :src="sectionBg" class="end-bg" aria-hidden="true" />
    <div class="end-overlay" />
    <div class="end-content">
      <div class="end-line" />
      <h1 class="end-title"><slot>THANK YOU!</slot></h1>
      <div class="end-line" />
    </div>
    <img :src="faviconUrl" class="end-favicon" alt="" />
  </div>
</template>

<script setup>
const sectionBg = new URL('../assets/section-bg.jpg', import.meta.url).href
const faviconUrl = new URL('../assets/favicon-white.png', import.meta.url).href
</script>

<style scoped>
.end {
  position: relative;
  overflow: hidden;
  height: 100%;
}

.end-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.end-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
}

.end-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1.5rem;
  padding: 3rem 6rem;
}

.end-line {
  width: 80%;
  height: 2px;
  background: #E78200;
}

.end-title {
  font-size: 3.5rem;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.end-favicon {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1;
  height: 40px;
}
</style>
