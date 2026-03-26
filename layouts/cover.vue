<template>
  <div class="slidev-layout cover dark">
    <OrangeEllipse side="right" />
    <div class="cover-content">
      <IteniumLogo variant="full" theme="dark" class="cover-logo" />
      <div class="cover-body">
        <h1 class="cover-title">{{ $slidev?.configs?.title ?? $frontmatter?.title }}</h1>
        <p v-if="$frontmatter?.subtitle" class="cover-subtitle">{{ $frontmatter.subtitle }}</p>
        <div class="cover-meta">
          <span v-if="$frontmatter?.speaker" class="cover-speaker">{{ $frontmatter.speaker }}</span>
          <span v-if="$frontmatter?.date" class="cover-date">{{ $frontmatter.date }}</span>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.cover {
  position: relative;
  overflow: hidden;
}
.cover-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2.5rem 3rem;
  gap: 1.5rem;
}
.cover-logo {
  height: 55px !important;
}
.cover-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  padding-right: 240px; /* leave room for ellipse */
}
.cover-title {
  font-size: 2.6rem;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0;
}
.cover-subtitle {
  font-size: 1.2rem;
  color: var(--color-primary);
  margin: 0;
  font-family: var(--font-body);
}
.cover-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 1rem;
  opacity: 0.7;
  font-size: 0.9rem;
  color: var(--color-text);
}
</style>
