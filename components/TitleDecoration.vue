<template>
  <span ref="marker" style="display:none" aria-hidden="true" />
</template>

<style>
.title-deco {
  display: inline !important;
  word-spacing: 0 !important;
  white-space: nowrap !important;
  margin-left: 0 !important;
}
.title-deco-start {
  margin-left: 0 !important;
  margin-right: 0.15em !important;
}
.title-deco-open {
  margin-left: 0 !important;
  margin-right: 0.1em !important;
}
.title-deco-close {
  margin-left: 0.1em !important;
}
.title-deco-end {
  margin-left: 0.1em !important;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  frontmatter: { type: Object, default: () => ({}) }
})

const marker = ref(null)

const TYPES = {
  dot:       { symbols: ['.'],      default: { position: 'end',   color: 'primary' } },
  slashes:   { symbols: ['.//'],    default: { position: 'end',   color: 'primary' } },
  hash:      { symbols: ['#'],      default: { position: 'start', color: 'primary' } },
  semicolon: { symbols: [';'],      default: { position: 'start', color: 'muted' } },
  brackets:  { symbols: ['[', ']'], default: { position: 'all',   color: 'primary' } },
  braces:    { symbols: ['{', '}'], default: { position: 'all',   color: 'primary' } },
}

const COLORS = {
  primary: '#f1b06c',
  muted: '#6ebca5',
  white: '#ffffff',
}

function createSpan(text, color) {
  const span = document.createElement('span')
  span.textContent = text
  span.style.color = COLORS[color] || COLORS.primary
  span.style.fontFamily = "'Rubik', sans-serif"
  span.style.fontStyle = 'normal'
  span.style.margin = '0'
  span.style.padding = '0'
  span.style.letterSpacing = '0'
  span.classList.add('title-deco')
  return span
}

function trimTextNodes(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    walker.currentNode.textContent = walker.currentNode.textContent.trim()
  }
  // Remove any trailing <br> or empty nodes
  while (el.lastChild && el.lastChild.nodeType === Node.TEXT_NODE && !el.lastChild.textContent.trim()) {
    el.removeChild(el.lastChild)
  }
}

function applyDecoration(el, config) {
  if (!el || !config?.type) return
  const t = TYPES[config.type]
  if (!t) return

  const color = config.color || t.default.color
  const position = config.position ?? t.default.position
  const isPaired = t.symbols.length === 2

  if (isPaired) {
    if (position === 'all') {
      const open = createSpan(t.symbols[0], color)
      const close = createSpan(t.symbols[1], color)
      if (config.type === 'brackets') {
        open.classList.add('title-deco-open')
        close.classList.add('title-deco-close')
      }
      el.prepend(open)
      el.append(close)
    } else {
      // Word range: "2" or "2-3"
      const words = el.textContent.split(/\s+/)
      let start, end
      if (String(position).includes('-')) {
        ;[start, end] = String(position).split('-').map(Number)
      } else {
        start = end = Number(position)
      }

      el.textContent = ''
      const before = words.slice(0, start - 1).join(' ')
      const target = words.slice(start - 1, end).join(' ')
      const after = words.slice(end).join(' ')

      if (before) el.append(document.createTextNode(before + ' '))
      const wOpen = createSpan(t.symbols[0], color)
      wOpen.classList.add('title-deco-open')
      el.append(wOpen)
      el.append(document.createTextNode(target))
      const wClose = createSpan(t.symbols[1], color)
      wClose.classList.add('title-deco-close')
      el.append(wClose)
      if (after) el.append(document.createTextNode(' ' + after))
    }
  } else {
    if (position === 'start') {
      const span = createSpan(t.symbols[0], color)
      span.classList.add('title-deco-start')
      el.prepend(span)
    } else {
      const span = createSpan(t.symbols[0], color)
      if (config.type !== 'dot') span.classList.add('title-deco-end')
      el.append(span)
    }
  }
}

onMounted(() => {
  const layout = marker.value?.closest('.slidev-layout')
  if (!layout) return

  if (props.frontmatter?.h1) {
    const h1 = layout.querySelector('h1')
    if (h1) { trimTextNodes(h1); applyDecoration(h1, props.frontmatter.h1) }
  }
  if (props.frontmatter?.h2) {
    const h2 = layout.querySelector('h2')
    if (h2) { trimTextNodes(h2); applyDecoration(h2, props.frontmatter.h2) }
  }
})
</script>
