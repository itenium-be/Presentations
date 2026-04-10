<template>
  <div class="slidev-layout break-layout" :class="{ 'break-vertical': $frontmatter.orientation === 'vertical' }">
    <template v-if="$frontmatter.orientation === 'vertical'">
      <div class="break-title">
        <slot name="default">
          <h1>☕ Break</h1>
        </slot>
      </div>
      <div class="break-image" v-if="$slots.image">
        <slot name="image" />
      </div>
      <div class="break-timer">
        <slot name="timer" />
      </div>
    </template>
    <template v-else>
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
    </template>
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

/* Vertical variant: title top, image middle (max space), timer bottom */
.break-layout.break-vertical {
  display: flex;
  flex-direction: column;
  grid-template-columns: none;
  padding: 1rem 2rem 0.25rem;
}

.break-vertical .break-title {
  flex: 0 0 auto;
  text-align: center;
  margin-bottom: 0.5rem;
}

.break-vertical .break-title :deep(h1) {
  font-size: 2rem;
}

.break-vertical .break-image {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
}

.break-vertical .break-image :deep(img) {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.break-vertical .break-timer {
  position: static;
  flex: 0 0 auto;
  margin-top: 0;
  text-align: center;
}

.break-vertical .break-timer :deep(.timer) {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.break-vertical .break-timer :deep(.timer-display) {
  font-size: 3rem;
}

.break-vertical .break-timer :deep(.timer-btn) {
  padding: 0.35rem 1.25rem;
  font-size: 1rem;
}
</style>
