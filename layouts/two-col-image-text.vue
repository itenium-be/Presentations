<template>
  <div class="slidev-layout two-col-image-text">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <div class="ic-title">
      <slot name="default" />
    </div>
    <div class="ic-columns" :class="{ 'image-only': !$slots.content }">
      <div class="ic-left" v-if="resolvedImage">
        <img :src="resolvedImage" alt="" />
      </div>
      <div class="ic-left" v-else-if="$slots.image">
        <slot name="image" />
      </div>
      <div class="ic-right" v-if="$slots.content" :class="'text-size-' + ($frontmatter?.textSize ?? 'md')">
        <slot name="content" />
      </div>
    </div>
    <TitleDecoration :frontmatter="$frontmatter" />
    <SlideFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href

// Eager-glob all presentation images so Vite includes them in the build.
// Keys are like '/images/foo.jpg', values are the resolved (hashed) URLs.
const imageModules = import.meta.glob('/images/**/*.{jpg,jpeg,png,gif,svg,webp}', { eager: true, query: '?url', import: 'default' })

const props = defineProps({
  image: { type: String, default: '' },
})

const resolvedImage = computed(() => {
  if (!props.image) return ''
  const key = props.image.replace(/^\.\//, '/')
  return imageModules[key] || props.image
})
</script>

<style scoped>
.two-col-image-text {
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
  font-size: 2.4rem;
  color: var(--color-text-dark);
  margin: 0;
}
.ic-title :deep(h2) {
  font-size: 1.5rem;
  color: var(--color-text-dark);
  font-weight: normal;
  font-style: italic;
  margin: 0.1rem 0 1rem;
}

.ic-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  flex: 1;
  min-height: 0;
  align-items: stretch;
  gap: 2rem;
}

.ic-left {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
}
.image-only {
  grid-template-columns: 1fr;
}
.image-only .ic-left {
  justify-content: center;
}
.ic-left > img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
.ic-left :deep(p) {
  display: contents;
}
.ic-left :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ic-right {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
.ic-right.text-size-xxl { font-size: 2.5rem; }
.ic-right.text-size-xl  { font-size: 2.2rem; }
.ic-right.text-size-lg  { font-size: 2rem; }
.ic-right.text-size-md  { font-size: 1.8rem; }
.ic-right.text-size-sm  { font-size: 1.5rem; }
.ic-right.text-size-xs  { font-size: 1.2rem; }

</style>
