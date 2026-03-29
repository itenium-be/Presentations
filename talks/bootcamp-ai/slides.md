---
theme: ../../
title: Bootcamp AI
date: 3/11/2026
image: ./images/coding.jpg
---

# SkillForge
# AI Bootcamp

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

---
layout: default
---

# Agenda

<div class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 items-center mt-8">
  <span class="w-10 h-10 rounded-full bg-[#E78200] text-white flex items-center justify-center text-xl font-bold">1</span>
  <span class="text-xl">Dagindeling</span>
  <span class="w-10 h-10 rounded-full bg-[#E78200] text-white flex items-center justify-center text-xl font-bold">2</span>
  <span class="text-xl">Claude Code</span>
  <span class="w-10 h-10 rounded-full bg-[#E78200] text-white flex items-center justify-center text-xl font-bold">3</span>
  <span class="text-xl">SkillForge</span>
  <span class="w-10 h-10 rounded-full bg-[#E78200] text-white flex items-center justify-center text-xl font-bold">4</span>
  <span class="text-xl">BMAD</span>
  <span class="w-10 h-10 rounded-full bg-[#E78200] text-white flex items-center justify-center text-xl font-bold">5</span>
  <span class="text-xl">Teams</span>
</div>

---
layout: section
---

# Dagindeling

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
layout: section
---

# Claude Code

---
layout: content-image
image: ./images/coding.jpg
---

# Claude Code
## Subscriptions

- Use your @itenium.be email
- Check Prep.md voor installatie instructies

**Required:** Docker, Claude Code, Git, Node (NVM), Bun, .NET 10 SDK

**Optioneel:** Visual Studio 2026 & Visual Studio Code, Postgres Desktop UI

**Or YOLO Vibe Coding (fuck the code)**

---
layout: section
---

# SkillForge

---
layout: default
---

# SkillForge
## What!?

- Kennis matrix itenium
- Groeipaden CCs

### Functionaliteiten
- **Users**: back-office, CC Coaches, consultants
- **Course Catalogue**: content creation and browsing
- **Course Enrolment & Learning Experience**: follow courses, progress tracking, feedback
- **Assessments & Quizzes**: complete quizzes to validate knowledge

---
layout: default
---

# SkillForge
## Tech Stack

- .NET 10, WebApi, EntityFramework, NUnit, TestContainers, NSubstitute using Itenium.Forge
- Docker, Postgres
- React, Vite, Playwright, Vitest, axios, TanStack Router/Query/Table, Radix UI with ChadCN (@itenium-forge/ui), Lucide Icons, Tailwind, Sonner (Toastr), Zod, Zustand (Redux), TypeScript

**But… Who cares ;)**

---
layout: section
---

# BMAD

---
layout: default
---

# BMAD
## Optional. Can also go YOLO

### Understanding BMAD
- Phase 1: Analysis → Brainstorming, research (optional)
- Phase 2: Planning → Create requirements
- Phase 3: Solutioning → Design architecture (BMad Method/Enterprise only)
- Phase 4: Implementation → Build epic by epic, story by story

### Different planning tracks
- Quick Flow: Bug fixes, simple features, clear scope (1-15 stories)
- BMad Method: Products, platforms, complex features (10-50+ stories)
- Enterprise: Compliance, multi-tenant systems (30+ stories)

---
layout: content-image
image: ./images/teamwork.jpg
---

# BMAD
## Install & Start

```bash
npx bmad-method install
```

```bash
claude
```

```
/bmad-help
```

**Use /bmad-help whenever unsure!**

---
layout: section
---

# Teams

---
layout: default
---

# Self-Organising Teams

- Each team has its own code base and backlog
- Organise however you want…
  - Traditional Roles with Analysis, Development and Testing?
  - Everyone Vibe Codes?
  - Pair or Mob Programming?
  - Code Reviews or Commit Straight to master?
  - Assign Priorities and UserStories?
  - **You decide!**

**Olivier, Michael and Bert act as ProductOwners** — They can answer any functional questions you may have

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

The winning team is decided by the Product Owners. They will look at:
- Delivered functionality
- Architecture
- Design (UX)

</div>
</div>

---
layout: quote
---

# Before we get started…

---
layout: default
---

# Tips
## More than Yolo???

- **KEEP FIRING**: When Claude is working on something, pass in other commands. You're looking at a screen? Give each change as a separate command.
- **BMAD Flow**: If you went to the trouble of creating a PRD and Epics, go through with creating the stories: flesh out as much as possible so that Claude comes back with something substantial.
- **DINNER**: Try to make Claude do as much as possible while we're eating!
- **Shift + Tab**: Switch between "Planning" and "Doing". Make sure Claude only starts writing code when you think it knows what you want.

---
layout: default
---

# Git Worktree
## What to do while the AI is "thinking"?

- Give it more work!

```bash
git worktree add ../feature-2
cd ../feature-2
claude
```

- Or:
  - Write tests (I mean... tell Claude to…)
  - Sketch the next feature
  - Review PRs

---
layout: default
---

# Managing Context

- **CLAUDE.md**: Keep it short, it's added to each session and LLMs have bad memory. Should only contain things that are not obvious from the code itself.
- **/clear**: Clear context when starting on something new. For example when starting on a new user story, or between coding and reviewing.
- **/compact**: Compact context, for example between planning and coding. When using BMAD, they suggest to use /clear though (different agents).

---
layout: default
---

# Workflow
## Github Issues? Beads? Yolo? ProjectStatus.md? Agent Teams?

- Example Github Issues:
  - Create the issues from BMAD hand-off md
  - Add a tag to the Github Issue to let everyone know you're working on this?
  - Let Claude create a Skill or Command to handle this (see for example `.claude/commands/PR.md`)

*Whatever you decide upon, if you are doing any manual action: Claude could be doing that while you're getting coffee.*

---
layout: default
---

# Agent Orchestration
## Conductor, Gas Town, …

Now native support in Claude:

```bash
CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---
layout: comparison
---

# Pick your team name & logo

<div class="cols">
<div class="col text-sm">

- **The Hallucination Hunters** — *We chase what shouldn't exist*
- **The Prompt Injectors** — *Prompts in, magic out*
- **The Token Burners** — *We learn by burning*
- **The AI Slop Sommeliers** — *We taste the chaos*
- **The YOLO Deployers** — *Deploy now, debug later*
- **The Tab Tab Tab Engineers** — *Automation over hesitation*

</div>
<div class="col text-sm">

- **The Prompt & Pray Engineers** — *Prompt. Pray. Repeat.*
- **The "Claude Carries Us" Department** — *We typed. Claude decided.*
- **The "Tests Are For Cowards" Club** — *Bravery over coverage*
- **The Model Collapse Survivors** — *Rising from the ashes of failed models*
- **The Main Branch Pushers** — *No staging, no fear*
- **The Vibe-Driven Developers** — *Good vibes, great code*

</div>
</div>
