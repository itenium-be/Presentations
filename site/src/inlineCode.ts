const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function inlineCodeToHtml(text: string): string {
  return text
    .replace(/[&<>"']/g, c => entities[c])
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}
