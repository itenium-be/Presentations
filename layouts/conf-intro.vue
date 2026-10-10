<template>
  <div class="slidev-layout conf-intro">
    <img :src="bgUrl" class="conf-intro-bg" aria-hidden="true" />
    <div class="conf-intro-title">
      <slot name="default" />
    </div>
    <IteniumLogo class="conf-intro-logo" />
  </div>
</template>

<script setup>
const bgUrl = new URL('../assets/conf-intro-bg.jpg', import.meta.url).href
</script>

<style scoped>
.conf-intro {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #222;
}

.conf-intro-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.conf-intro-title {
  position: absolute;
  top: 3.5%;
  left: 3%;
}
.conf-intro-title :deep(h1) {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: 96px;
  line-height: 0.99;
  letter-spacing: -0.088em;
  color: #FFFEF4;
}
.conf-intro-title :deep(h1:nth-of-type(1)) { color: #61DBFB; }
.conf-intro-title :deep(h1:nth-of-type(3)) { color: #E78200; }

.conf-intro-logo {
  position: absolute;
  right: 3%;
  bottom: 5%;
  width: 22%;
}
</style>
