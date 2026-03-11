# Wayfinder

**Navigating the generative UI landscape.**

A Manzanita Research project. An explorable explanation comparing how generative UI frameworks work — their architectures, data flows, tradeoffs, and developer experience — through the lens of the same user interaction.

Like [TodoMVC](https://todomvc.com/), but for the age of agents.

---

## What This Is

A website (starting as an explorable explanation, with a repo of code examples to follow) that compares four generative UI frameworks by showing how each handles the same scenario: a user asks an AI agent "find me a hotel in Paris" and the agent responds with a rich, interactive UI.

The site shows:
- **How each framework describes the UI** (what format the LLM outputs)
- **How data flows** from user query → agent → UI spec → renderer → screen
- **What the developer writes** (component registration, catalog definition, etc.)
- **What gets rendered** (the same hotel card, four different paths)
- **Tradeoffs** — strengths and considerations for each approach

## The Four Frameworks (v1 scope)

### 1. A2UI (Google)
- **What it is:** An open protocol/spec — the most framework-agnostic approach
- **UI format:** Streaming JSONL (adjacency list model)
- **Key idea:** Declarative component blueprints sent across trust boundaries. Designed for scenarios where the agent generating UI is NOT controlled by the app developer.
- **Three-message envelope:** `surfaceUpdate` (component tree) → `dataModelUpdate` (state/data) → `beginRendering` (render signal)
- **Data binding:** `$data` references that bind component props to the data model
- **Renderers:** Angular, Flutter, Lit, React, Markdown — truly cross-platform
- **Spec status:** v0.8 stable, v0.9 draft
- **Site:** https://a2ui.org
- **By:** Google (Apache 2.0, with contributions from CopilotKit)

### 2. OpenUI Lang (Thesys)
- **What it is:** A compact streaming-first language + React runtime
- **UI format:** OpenUI Lang — a custom line-oriented, function-call syntax (NOT JSON, NOT JSX)
- **Key idea:** Token efficiency. Up to 67% fewer tokens than JSON approaches. The syntax looks like: `root = Carousel([c1, c2, c3])` then `c1 = HotelCard("title", "desc", "url", "cta")`
- **Component model:** `defineComponent` + `createLibrary` with Zod schemas. The library auto-generates the LLM system prompt.
- **Renderers:** React (primary), React Native planned
- **Thesys also has C1:** A hosted Generative UI API (OpenAI-compatible endpoint that returns structured UI). OpenUI is the open-source layer; C1 is the commercial hosted service.
- **Site:** https://openui.com
- **By:** Thesys Inc (San Francisco)

### 3. json-render (Vercel)
- **What it is:** JSON schema + React runtime with code export
- **UI format:** Pure JSON with a flat element tree and catalog constraints
- **Key idea:** Rich built-in component library (39 components, 6 actions) + the ability to export generated UI as standalone React code with zero runtime dependencies.
- **Component model:** `defineCatalog` with Zod schemas, `hasChildren` slots
- **Data binding:** `$state`, `$item`, `$index`, `$bindState` for two-way binding
- **Renderers:** React, React Native
- **11k GitHub stars** under vercel-labs
- **Site:** https://json-render.dev
- **By:** Vercel

### 4. Tambo (Fractal Dynamics)
- **What it is:** Full-stack agent SDK + hosted platform — the most batteries-included option
- **UI format:** React components registered via `TamboProvider` with Zod schemas
- **Key idea:** Fastest path from zero to working agent UI. Wrap your app, register your existing components, done. Tambo handles the agent runtime, streaming, state, conversations, auth, and MCP.
- **Component model:** Register existing React components with description + Zod propsSchema
- **Hosting:** Cloud service (free tier: 10K msgs/mo, growth: $25/mo) OR fully self-hostable open source
- **Built-in:** Auth, conversation storage, MCP support, analytics, multi-model support
- **11.1k GitHub stars**
- **Site:** https://tambo.co
- **By:** Fractal Dynamics Inc

## The Shared Insight

Despite their differences, all four frameworks share a core architectural pattern: **the LLM selects and populates components from a pre-defined catalog, not generate arbitrary UI code.** They all use Zod schemas to define what's allowed, they all support streaming, and they all reject letting an LLM write raw HTML/JSX.

Where they diverge:
- **Encoding:** JSONL vs. compact function-call language vs. JSON vs. React props
- **Bundling:** Pure spec vs. runtime vs. full platform
- **Trust model:** Cross-boundary agents vs. your-own-agent-only
- **Platform reach:** Cross-platform vs. React-only

## The Spectrum

These frameworks exist on a spectrum from "pure spec / BYO everything" to "batteries included / managed":

```
← Protocol                                              Platform →
   A2UI          OpenUI Lang       json-render          Tambo
   (Google)      (Thesys)          (Vercel)             (Fractal)
```

## Important Context: What We're NOT Comparing (but should acknowledge)

- **AG-UI** (CopilotKit) — the transport/runtime layer BENEATH these UI specs. It's the bidirectional connection between agent and frontend. A2UI and AG-UI are complementary, not competing.
- **MCP Apps** — the iframe-based approach where the server owns the full UI experience. Different paradigm entirely.
- **CopilotKit** itself — a full React framework that sits above AG-UI and can consume A2UI specs.

The v1 Wayfinder site focuses on the **UI specification layer** — the four approaches listed above. Future versions could map the full stack.

## Design Direction

This is a Manzanita Research project. Apply brand tokens:
- **Typography:** Fraunces (display, weight 600, `letter-spacing: -0.04em`, `font-variation-settings: 'WONK' 1, 'SOFT' 100`), Source Serif 4 (body), IBM Plex Mono (code — since Commit Mono can't load in browser artifacts, IBM Plex Mono is the stand-in)
- **Colors:** cream `#FAF9F6`, warm-black `#2C2C2C`, bark `#6B3A2A`, terracotta `#C2714F`, sage `#8B9E7E`, ochre `#C49A3C`, rust `#A0522D`, lavender-dried `#9B8EA8`, fog `#E8E5DF`, dusk `#5C5C5C`
- **Texture:** Film grain overlay, warm shadows, paper-like surfaces
- **Each framework gets its own accent color** for identification: A2UI (Google blue `#4285F4`), OpenUI (warm orange `#E86C3A`), json-render (black `#000000`), Tambo (purple `#6C5CE7`)

## Code Syntax Highlighting

Custom syntax highlighter built in (no external deps). Uses Manzanita-warm tones on dark background:
- Section headers: terracotta
- Comments: muted warm gray, italic
- Strings: sage green
- Numbers: ochre gold
- Keywords: warm gold
- Property keys: warm stone
- JSX/component tags: terracotta bold
- Attributes: lavender
- `$data`/`$state` refs: terracotta
- Line numbers in gutter

## Current State

A v1 React artifact exists (`genui-explorer.jsx`) with three views:

1. **Overview** — landscape cards, the protocol→platform spectrum visualization, and "one query, four architectures" interactive section with tabbed framework switching showing data flow + developer experience code
2. **Deep Dive** — full breakdown per framework: summary, data flow diagram, code block, tradeoffs (strengths vs. considerations)
3. **Side by Side** — comparison table across 8 dimensions, "the shared pattern" insight callout, and "when to use what" guidance cards

### Known issues / next steps:
- Data flow diagrams are text-based numbered lists — should become animated visual diagrams showing data actually moving through the pipeline (this is the big "explorable explanation" upgrade)
- Could add a "what the user sees" rendered output mockup for each framework
- The comparison table could use better mobile responsiveness
- Code examples use pseudocode style (to avoid artifact import scanner issues) — for the standalone site these can be real syntax
- Should add links to each framework's docs, GitHub, etc. more prominently
- Consider adding token count comparisons (OpenUI's benchmark data)
- Consider adding an "anatomy of a response" view that highlights the actual bytes/tokens flowing

## Repo Structure (proposed)

```
wayfinder/
├── site/                    # The explorable explanation website
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── data/            # Framework data (extracted from artifact)
│   │   └── ...
│   └── package.json
├── examples/                # TodoMVC-style code examples (future)
│   ├── a2ui/
│   ├── openui-lang/
│   ├── json-render/
│   └── tambo/
├── WAYFINDER.md             # This file
└── README.md
```

## Voice & Tone

This is a Manzanita project but it's developer-facing and educational. The tone should be:
- **Clear and direct** — developers are evaluating tools, don't make them decode poetry
- **Fair** — we're not affiliated with any of these frameworks. Present tradeoffs honestly. No rankings.
- **Warm but not cute** — Manzanita character without being precious about it
- **The naturalist's field guide, not the travel brochure** — identify and describe, don't sell

Tagline candidates:
- "Navigating the generative UI landscape"
- "Same query. Four architectures."
- "How agents describe interfaces"
