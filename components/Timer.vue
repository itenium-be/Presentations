<template>
  <div class="timer">
    <div class="timer-display">{{ display }}</div>
    <div class="timer-controls" v-if="!running && remaining === totalSeconds">
      <button @click="start" class="timer-btn">Start</button>
    </div>
    <div class="timer-controls" v-else-if="running">
      <button @click="pause" class="timer-btn">Pause</button>
    </div>
    <div class="timer-controls" v-else-if="remaining > 0">
      <button @click="start" class="timer-btn">Resume</button>
      <button @click="reset" class="timer-btn timer-btn--secondary">Reset</button>
    </div>
    <div class="timer-controls" v-else>
      <button @click="reset" class="timer-btn">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  minutes?: number | string
}>(), {
  minutes: 15,
})

const totalSeconds = Number(props.minutes) * 60
const remaining = ref(totalSeconds)
const running = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

const display = computed(() => {
  const m = Math.floor(remaining.value / 60)
  const s = remaining.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function start() {
  running.value = true
  interval = setInterval(() => {
    if (remaining.value > 0) {
      remaining.value--
    } else {
      running.value = false
      if (interval) clearInterval(interval)
    }
  }, 1000)
}

function pause() {
  running.value = false
  if (interval) clearInterval(interval)
}

function reset() {
  pause()
  remaining.value = totalSeconds
}

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.timer-display {
  font-family: 'Fira Code', monospace;
  font-size: 8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: inherit;
}

.timer-controls {
  display: flex;
  gap: 1rem;
}

.timer-btn {
  padding: 0.6rem 2rem;
  font-size: 1.2rem;
  font-family: var(--font-heading);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #E78200;
  color: white;
}

.timer-btn:hover {
  opacity: 0.9;
}

.timer-btn--secondary {
  background: #7e7e7e;
}
</style>
