---
theme: ../../
title: Bootcamp AI
date: 3/11/2026
transition: fade
---

# SkillForge
# AI Bootcamp

::image::

![](./images/cover-art.jpg)

---
layout: default
---

# AI Track

- 13/3: AI Bootcamp
- 1/4: AI & Security: The S in MCP Stands for Security
- 11/5: AI-Driven Development: Het AI Bootcamp in detail
- 1/10: MCP Servers: Is this how Skynet started?
- 25/11: Predicting mental fatigue using AI (Pierre)
- TBD: The Math Behind the AI Curtain (Tom)

<!--
Speaker notes go here — only visible in presenter mode (localhost:3030/presenter).
Mention that dates might still shift.
-->

---
layout: agenda
items:
  - Dagindeling
  - Claude Code
  - SkillForge
  - BMAD
  - Teams
---

---
layout: section
---

# Dagindeling

::subtitle::

AI Bootcamp — 11 maart 2026

---
layout: default
---

# Dagindeling

- 9u: Start Powerpoint
- 9u30: Development
- 12u: Dinner
- 13u: Team Demos
- 13u30: Development
- 16u: Final Team Demos
- 16u45: Winning Team
- 17u: Drinks!!


---
layout: content-image
---

# BMAD
## Install & Start

```bash
npx bmad-method install
claude
/bmad-help
```

**Use `/bmad-help` whenever unsure!**

::image::

![](./images/teamwork.jpg)


---
layout: default
---

# Interactive Code

```ts {monaco-run}
interface User {
  name: string
  role: 'dev' | 'coach' | 'admin'
}

const team: User[] = [
  { name: 'Alice', role: 'dev' },
  { name: 'Bob', role: 'coach' },
  { name: 'Charlie', role: 'dev' },
]

const devs = team.filter(u => u.role === 'dev')
console.log(`Devs: ${devs.map(d => d.name).join(', ')}`)
```

---
layout: default
---

# Code Walkthrough

```ts {1-4|6-10|12-13}{lines:true,at:0}
interface User {
  name: string
  role: 'dev' | 'coach' | 'admin'
}

const team: User[] = [
  { name: 'Alice', role: 'dev' },
  { name: 'Bob', role: 'coach' },
  { name: 'Charlie', role: 'dev' },
]

const devs = team.filter(u => u.role === 'dev')
console.log(`Devs: ${devs.map(d => d.name).join(', ')}`)
```

<div class="relative h-8">
<div v-click.hide="1" class="absolute">👆 Define a <strong>User</strong> type with name and role</div>
<div v-click="[1,2]" class="absolute">👆 Create an array of users with different roles</div>
<div v-click="2" class="absolute">👆 Filter to keep only the devs, then log their names</div>
</div>

---
layout: default
---

# In-Depth Code Walkthrough
## Using Magic Move

````md magic-move
```ts {6-9}{lines:true}
interface User {
  name: string
  role: 'dev' | 'coach' | 'admin'
}

const team: User[] = [
  { name: 'Alice', role: 'dev' },       // <-- role
  { name: 'Bob', role: 'coach' },       // <-- role
  { name: 'Charlie', role: 'dev' },     // <-- role
]

const devs = team.filter(u => u.role === 'dev')
```

```ts {5}{lines:true}
interface User {
  name: string
  role: 'dev' | 'coach' | 'admin'
}

const team: User[] = [
  { name: 'Alice', role: 'dev' },
  { name: 'Bob', role: 'coach' },
  { name: 'Charlie', role: 'dev' },
]

const devs = team.filter(u => u.role === 'dev')
//            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//            Filters by the role property!
```
````

---
layout: comparison
---

# Team Demos

<div class="cols">
<div class="col">

### Each Team assigns a Proxy

- At 13h the proxy gives a demo of the developed functionality
- At 16h the proxy gives the final team demo!

</div>
<div class="col">

### Winning Team

- The winning team is decided by the Product Owners.
- They will look at:
  - Delivered functionality
  - Architecture
  - Design (UX)

</div>
</div>

---
layout: quote-alt
---

The best way to predict the future is to invent it.

::author::

**Alan Kay**

Computer Scientist

---
layout: quote
---

# Before we get started…

---
layout: default
---

# Tips
## More than Yolo???

<v-clicks depth="2">

- Plan Mode
- Frameworks
  - BMAD
  - SpecKit
  - Superpowers

</v-clicks>

---
layout: default
---

# AI Bootcamp Flow

```mermaid
graph LR
  A[☕ Kickoff] --> B[🧠 BMAD Planning]
  B --> C[💻 Development]
  C --> D[🍕 Lunch]
  D --> E[📊 Team Demo]
  E --> F[💻 Development]
  F --> G[🏆 Final Demo]
  G --> H[🍻 Drinks!]
```
