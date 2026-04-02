<template>
  <div class="slidev-layout break-layout">
    <div class="break-image" v-if="$slots.image">
      <slot name="image" />
    </div>
    <div class="break-content">
      <div class="break-title">
        <slot name="default">
          <h1>☕ Break</h1>
        </slot>
      </div>
      <div class="break-timer">
        <slot name="timer" />
      </div>
    </div>
    <IteniumLogo class="break-logo" />
    <TitleDecoration :frontmatter="$frontmatter" />
  </div>
</template>

<style scoped>
.break-layout {
  position: relative;
  overflow: hidden;
  height: 100%;
  background-color: #6fbda5;
  display: grid;
  grid-template-columns: 38% 1fr;
}

.break-image {
  position: relative;
  overflow: hidden;
}
.break-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.break-content {
  display: flex;
  flex-direction: column;
  padding: 3rem 4rem;
}

.break-title :deep(h1) {
  font-size: 3rem;
  color: #fff;
  margin: 0;
}

.break-timer {
  position: absolute;
  top: 200px;
  right: 3rem;
  color: #fff;
}

.break-logo {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  height: 30px !important;
}
</style>
