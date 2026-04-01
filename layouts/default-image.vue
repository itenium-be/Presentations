<template>
  <div class="slidev-layout default-image">
    <img :src="dotsOrange" class="dots dots-orange" aria-hidden="true" />
    <div class="circle-image" :class="'pos-' + ($frontmatter?.['image-position'] ?? 'top-right')" v-if="$slots.image">
      <slot name="image" />
    </div>
    <div class="content" :class="'size-' + ($frontmatter?.size ?? 'md')">
      <slot />
    </div>
    <SlideFooter />
  </div>
</template>

<script setup>
const dotsOrange = new URL('../assets/dots-orange.png', import.meta.url).href
</script>

<style scoped>
.default-image {
  position: relative;
  overflow: hidden;
  background: white;
  color: var(--color-text-dark);
  height: 100%;
}

.dots {
  position: absolute;
  pointer-events: none;
  height: 55%;
  width: auto;
  opacity: 0.6;
}
.dots-orange {
  top: 15%;
  left: -50px;
  transform: scaleX(-1);
}

.circle-image {
  position: absolute;
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  border: 0.5rem solid #E78200;
  overflow: hidden;
  z-index: 2;
}
.circle-image.pos-top-right {
  top: 20px;
  right: 10px;
}
.circle-image.pos-middle-right {
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}
.circle-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  position: relative;
  z-index: 1;
  --content-pad-left: 6rem;
  --content-pad-right: 16rem;
  padding: 2rem var(--content-pad-right) 3rem var(--content-pad-left);
  height: 100%;
  box-sizing: border-box;
}
.content :deep(h1) {
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-dark);
}
.content :deep(h2) {
  font-size: 1.2rem;
  color: var(--color-text-dark);
  font-weight: normal;
  font-style: italic;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
}
.content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
}
.content :deep(ul ul) {
  list-style-type: circle;
  font-size: 0.85em;
}
.content :deep(li) {
  margin-bottom: 0.25rem;
}

/* Tables */
.content :deep(table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0.5rem;
  overflow: hidden;
  font-size: 0.85em;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.content :deep(thead) {
  background: var(--color-primary);
  color: var(--color-text);
}
.content :deep(th) {
  font-family: var(--font-heading);
  font-weight: 500;
  text-align: left;
  padding: 0.6em 1em;
}
.content :deep(td) {
  padding: 0.5em 1em;
  border-bottom: 1px solid #e5e5e5;
}
.content :deep(tbody tr:last-child td) {
  border-bottom: none;
}
.content :deep(tbody tr:nth-child(even)) {
  background: var(--color-bg-light);
}
.content :deep(tbody tr:hover) {
  background: #fde0d0;
}

/* Dense table variant */
.content :deep(.dense table) {
  font-size: 0.75em;
}
.content :deep(.dense th) {
  padding: 0.3em 0.6em;
}
.content :deep(.dense td) {
  padding: 0.2em 0.6em;
}

/* Font size variants via frontmatter `size` */
.content.size-xxl { font-size: 2.5rem; }
.content.size-xl  { font-size: 2.2rem; }
.content.size-lg  { font-size: 2rem; }
.content.size-md  { font-size: 1.8rem; }
.content.size-sm  { font-size: 1.5rem; }
.content.size-xs  { font-size: 1.2rem; }
</style>
