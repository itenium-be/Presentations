<template>
  <div class="slidev-layout image-content">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <div class="ic-title">
      <slot name="default" />
    </div>
    <div class="ic-columns" :class="{ 'image-only': !$slots.content }">
      <div class="ic-left" v-if="$slots.image">
        <slot name="image" />
      </div>
      <div class="ic-right" v-if="$slots.content" :class="'size-' + ($frontmatter?.size ?? 'md')">
        <slot name="content" />
      </div>
    </div>
    <SlideFooter />
  </div>
</template>

<script setup>
const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href
</script>

<style scoped>
.image-content {
  position: relative;
  overflow: hidden;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 2rem 2.5rem 3rem;
  box-sizing: border-box;
}

.dots {
  position: absolute;
  pointer-events: none;
  height: 55%;
  width: auto;
  opacity: 0.6;
}
.dots-orange {
  top: -15%;
  right: -50px;
}

.ic-title {
  text-align: center;
  flex-shrink: 0;
}
.ic-title :deep(h1) {
  font-size: 2rem;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
}

.ic-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  align-items: center;
  gap: 2rem;
}

.ic-left {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}
.image-only {
  grid-template-columns: 1fr;
}
.image-only .ic-left {
  justify-content: center;
}
.ic-left :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ic-right {
  position: relative;
  z-index: 1;
}

.ic-right :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}
.ic-right :deep(ul ul) {
  list-style-type: circle;
  font-size: 0.85em;
}
.ic-right :deep(li) {
  margin-bottom: 0.25rem;
}

/* Font size variants via frontmatter `size` */
.ic-right.size-xxl { font-size: 2.5rem; }
.ic-right.size-xl  { font-size: 2.2rem; }
.ic-right.size-lg  { font-size: 2rem; }
.ic-right.size-md  { font-size: 1.8rem; }
.ic-right.size-sm  { font-size: 1.5rem; }
.ic-right.size-xs  { font-size: 1.2rem; }

</style>
