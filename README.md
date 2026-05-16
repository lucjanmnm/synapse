# 🧠 Synapse

> Personal second-brain system for life management, productivity, health, growth and long-term progress.

Synapse is not another AI chatbot or classic task manager.

It’s a:
- 🧠 second brain
- ⚡ personal operating system
- 📊 life dashboard
- 🤖 AI prompt generator
- 📅 planning system
- 📈 progress tracker
- 🛠️ self-management tool

Built to reduce chaos, improve clarity and create sustainable progress without burnout.

---

# ✨ Philosophy

Synapse focuses on:
- low friction workflow
- fast daily usage
- realistic execution
- clarity over motivation
- structure over chaos
- sustainability over intensity

This project is intentionally:
- minimalist
- modular
- personal
- practical
- and highly customizable

The goal is NOT to build:
- ❌ autonomous AI agents
- ❌ overengineered systems
- ❌ another bloated productivity app

The goal IS to build:
- ✅ a real daily tool
- ✅ a life dashboard
- ✅ a contextual AI workflow
- ✅ a personal operating system

---

# 🚀 Features

## 🏠 Dashboard

Main dashboard includes:
- weekly overview
- daily overview
- quick stats
- recent logs
- sleep tracking
- mood/stress tracking
- training summary
- goals
- calendar section
- AI prompt generator

Inspired by:
- Linear
- Notion
- Raycast
- Arc Browser

---

## ⚡ Quick Add System

Fast data logging with minimal friction.

Examples:
```txt
waga 72.1
sen 7h
mega produktywny dzień
kolano boli po treningu
pierwsze pieniądze z zamówienia
```

Track:
- ⚖️ weight
- 😴 sleep
- 🏋️ workouts
- 📈 productivity
- 😵 stress
- 🙂 mood
- ❤️ relationship
- 📝 notes
- 💡 ideas
- 📆 daily reviews

---

## 🤖 AI Prompt Generator

Core feature of the project.

Instead of replacing Claude AI, Synapse generates:
- contextual prompts
- summaries
- reviews
- planning prompts
- recovery prompts
- gym prompts
- business prompts

Based on:
- recent logs
- stress level
- sleep
- productivity
- goals
- priorities
- weekly context

Example:
```txt
Current state:
- sleep: 7h
- energy: low
- stress: high
- knee pain after workout
- earned first money 
- unfinished school tasks

Generate a realistic daily plan focused on recovery,
clarity and execution without overload.
```

---

## 📊 Weekly Review System

Track:
- energy
- stress
- productivity
- health
- relationship quality
- consistency
- biggest wins
- biggest mistakes
- chaos sources
- priorities

Designed for:
- reflection
- pattern detection
- optimization
- and long-term awareness

---

## 📈 Data Visualization

Minimal and clean charts:
- weight
- sleep
- stress
- productivity
- training
- consistency

No bloated analytics.
Only useful information.

---

# 🛠️ Tech Stack

## Frontend
- ⚛️ Next.js
- 📘 TypeScript
- 🎨 Tailwind CSS
- 🧩 shadcn/ui

## Backend
- 🟢 Supabase

## AI Providers
Compatible with:
- Claude API
- OpenAI API
- Gemini API
- OpenRouter
- Groq

---

# 📦 Installation

## 1️⃣ Clone repository

```bash
git clone https://github.com/lucjanmnm/synapse.git
cd synapse
```

---

## 2️⃣ Install dependencies

```bash
npm install
```

---

## 3️⃣ Create environment file

Create:

```txt
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

Use only providers you actually need.

---

# 🟢 Supabase Setup

## Create project

Go to:
👉 https://supabase.com

Create a new project.

---

## Enable Authentication

Recommended:
- Email auth

Optional:
- Google auth
- GitHub auth

---

## Suggested Database Tables

```txt
users
logs
workouts
sleep
mood
reviews
prompts
goals
notes
```

---

# ▶️ Running Locally

```bash
npm run dev
```

Open:
👉 http://localhost:3000

---

# 📁 Recommended Structure

```txt
/app
/components
/lib
/hooks
/services
/utils
/types
/styles
/supabase
```

---

# 🚫 Recommended .gitignore

```gitignore
node_modules
.next
.env
.env.local
```

---

# 🧠 Personal Configuration

Synapse is designed mainly for personal use.

You are expected to:
- customize prompts
- adjust workflows
- modify tracking systems
- adapt the dashboard to your life
- build your own second-brain workflow

The project should evolve around:
- your habits
- your goals
- your routines
- your mental patterns
- and your real daily usage

---

# 🔮 Future Ideas

Possible future additions:
- 🍎 Apple Health integration
- ⌚ Garmin sync
- 📅 Google Calendar sync
- 📱 mobile app
- 🎙️ voice input
- 🧠 AI summaries
- 📊 advanced pattern detection
- 🔥 deep work mode
- 🎯 habit systems
- 💤 recovery analysis
- 📈 long-term analytics

---

# ⚠️ Important

Do NOT overengineer this project.

The value of Synapse comes from:
- simplicity
- consistency
- low friction
- and real usage

Not from trying to build:
- autonomous AI
- complex agent systems
- or a giant SaaS platform

Build slowly.
Optimize what you actually use.
Remove unnecessary complexity.

---

# 📄 License

> MIT License

Feel free to modify and adapt the project for personal use.