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
