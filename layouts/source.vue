<template>
  <div class="slidev-layout source">
    <h1 class="source-title">Powerpoint Source</h1>
    <div class="source-qr">
      <QRCode :url="`https://github.com/${$frontmatter?.source ?? 'itenium-be'}`" color="#343434" />
    </div>
    <a :href="`https://github.com/${$frontmatter?.source ?? 'itenium-be'}`" class="source-link">
      github.com/{{ $frontmatter?.source ?? 'itenium-be' }}
    </a>
  </div>
</template>

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
