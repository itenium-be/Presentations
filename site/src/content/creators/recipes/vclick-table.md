---
title: v-click table
summary: "Table that reveals rows on click. Cells accept HTML."
order: 2
tags: ["<VClickTable>"]
live: { deck: showcase, slide: vclick-table }
---

```vue
<VClickTable
  :headers="['Defense', 'Approach', 'Solves it?']"
  :rows="[
    ['<b>Constitutional AI</b>', 'Self-critique', 'No'],
    ['<b>Prompt Shields</b>', 'Pattern scanning', 'No'],
  ]"
  :firstVisible="1"
  size="sm"
/>
```

| Prop              | Type                   | Default  | Description                                   |
|-------------------|------------------------|----------|-----------------------------------------------|
| `headers`         | `string[]`             | required | Column headers                                |
| `rows`            | `string[][]`           | required | Row data (HTML allowed)                       |
| `firstVisible`    | `number`               | `1`      | Rows visible immediately                      |
| `size`            | `lg` \| `md` \| `sm`   | `md`     | `sm` is dense                                 |
| `separatorBefore` | `number[]`             | `[]`     | Row indices (0-based) with an orange top line |
