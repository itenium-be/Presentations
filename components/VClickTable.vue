<template>
  <div :class="{ 'vclick-table-dense': props.size === 'sm' }">
    <table class="vclick-table">
      <thead>
        <tr>
          <th v-for="(header, i) in headers" :key="i">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in visibleRows"
          :key="'v' + rowIndex"
          :class="{ separator: separatorBefore.includes(rowIndex) }"
        >
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" v-html="cell" />
        </tr>
        <tr
          v-for="(row, rowIndex) in clickableRows"
          :key="'c' + rowIndex"
          v-click="rowIndex + 1"
          :class="{ separator: separatorBefore.includes(rowIndex + firstVisible) }"
        >
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" v-html="cell" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  headers: string[]
  rows: string[][]
  firstVisible?: number
  size?: 'lg' | 'md' | 'sm'
  separatorBefore?: number[]
}>(), {
  firstVisible: 1,
  size: 'md',
  separatorBefore: () => [],
})

const visibleRows = computed(() => props.rows.slice(0, props.firstVisible))
const clickableRows = computed(() => props.rows.slice(props.firstVisible))
</script>

<style scoped>
tr.separator td {
  border-top: 3px solid var(--color-primary);
}

.vclick-table-dense .vclick-table {
  font-size: 0.75em;
}
.vclick-table-dense .vclick-table th {
  padding: 0.3em 0.6em;
}
.vclick-table-dense .vclick-table td {
  padding: 0.2em 0.6em;
}
</style>
