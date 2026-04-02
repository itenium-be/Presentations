<template>
  <div class="slidev-layout agenda">
    <div class="agenda-image">
      <img :src="agendaBg" alt="" />
    </div>
    <div class="agenda-content" :class="'size-' + ($frontmatter?.size ?? 'md')">
      <h1>Agenda</h1>
      <div class="agenda-items">
        <template v-for="(item, i) in ($frontmatter?.items ?? [])" :key="i">
          <span class="agenda-number">{{ i + 1 }}</span>
          <span class="agenda-label">{{ item }}</span>
        </template>
      </div>
    </div>
    <TitleDecoration :frontmatter="$frontmatter" />
    <SlideFooter />
  </div>
</template>

<script setup>
const agendaBg = new URL('../assets/agenda-bg.jpg', import.meta.url).href
</script>

<style scoped>
.agenda {
  position: relative;
  overflow: hidden;
  background: white;
  color: var(--color-text-dark);
  height: 100%;
  display: grid;
  grid-template-columns: 38% 1fr;
}

.agenda-image {
  position: relative;
  overflow: hidden;
}
.agenda-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agenda-content {
  position: relative;
  z-index: 1;
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.agenda-content h1 {
  font-size: 2.4rem;
  margin-bottom: 2rem;
  color: var(--color-text-dark);
}

.agenda-items {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.2rem 1.5rem;
  align-items: center;
}

.agenda-number {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #E78200;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: bold;
}

.agenda-label {
  font-size: 2rem;
  font-family: var(--font-heading);
}

/* Size variants via frontmatter `size` */
.agenda-content.size-lg .agenda-items { gap: 1.2rem 1.5rem; }
.agenda-content.size-lg .agenda-number { width: 3rem; height: 3rem; font-size: 1.4rem; }
.agenda-content.size-lg .agenda-label { font-size: 2rem; }

.agenda-content.size-md .agenda-items { gap: 1rem 1.2rem; }
.agenda-content.size-md .agenda-number { width: 2.6rem; height: 2.6rem; font-size: 1.2rem; }
.agenda-content.size-md .agenda-label { font-size: 1.7rem; }

.agenda-content.size-sm .agenda-items { gap: 0.8rem 1rem; }
.agenda-content.size-sm .agenda-number { width: 2.2rem; height: 2.2rem; font-size: 1rem; }
.agenda-content.size-sm .agenda-label { font-size: 1.4rem; }

.agenda-content.size-xs .agenda-items { gap: 0.6rem 0.8rem; }
.agenda-content.size-xs .agenda-number { width: 2rem; height: 2rem; font-size: 0.9rem; }
.agenda-content.size-xs .agenda-label { font-size: 1.2rem; }
</style>
