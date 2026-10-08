import { describe, expect, test } from 'bun:test'
import { inlineCodeToHtml } from './inlineCode'

describe('inlineCodeToHtml', () => {
  test('wraps backtick spans in code tags', () => {
    expect(inlineCodeToHtml('`git worktree` gives each agent a `main`'))
      .toBe('<code>git worktree</code> gives each agent a <code>main</code>')
  })

  test('escapes html, also inside code spans', () => {
    expect(inlineCodeToHtml("each other's <work> & `a<b>`"))
      .toBe('each other&#39;s &lt;work&gt; &amp; <code>a&lt;b&gt;</code>')
  })

  test('leaves an unpaired backtick alone', () => {
    expect(inlineCodeToHtml('a ` b')).toBe('a ` b')
  })
})
