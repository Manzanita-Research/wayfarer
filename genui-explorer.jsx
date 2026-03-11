import { useState } from "react";

const COLORS = {
  cream: '#FAF9F6',
  warmBlack: '#2C2C2C',
  bark: '#6B3A2A',
  terracotta: '#C2714F',
  sage: '#8B9E7E',
  ochre: '#C49A3C',
  rust: '#A0522D',
  lavenderDried: '#9B8EA8',
  fog: '#E8E5DF',
  dusk: '#5C5C5C',
};

// Framework data
const FRAMEWORKS = {
  a2ui: {
    name: "A2UI",
    by: "Google",
    tagline: "Protocol for agent-driven interfaces",
    color: '#4285F4',
    kind: "Open Protocol / Spec",
    url: "https://a2ui.org",
    uiFormat: "JSONL (streaming adjacency list)",
    renderers: "Angular, Flutter, Lit, React, Markdown",
    llmGeneration: "Yes — designed for streaming LLM output",
    componentModel: "Declarative blueprints from a catalog",
    stateBinding: "Data model updates via dataModelUpdate messages",
    streaming: "Native — JSONL line-by-line",
    security: "Declarative data, no code execution",
    crossPlatform: "Web, mobile, desktop, native",
    hosting: "Self-hosted (open spec)",
    trustModel: "Designed for untrusted agents across trust boundaries",
    summary: "A2UI is the most protocol-oriented approach. It's a specification, not a library — think of it like HTML for agent UIs. Agents send declarative component descriptions as streaming JSONL, and any renderer can interpret them. The key insight is trust boundaries: A2UI is designed for scenarios where the agent generating UI is not controlled by the app developer.",
    dataFlow: [
      { label: "User sends message", from: "user", to: "agent" },
      { label: "Agent generates A2UI JSONL", from: "agent", to: "stream" },
      { label: "surfaceUpdate — component tree", from: "stream", to: "renderer" },
      { label: "dataModelUpdate — state/data", from: "stream", to: "renderer" },
      { label: "beginRendering — render signal", from: "stream", to: "renderer" },
      { label: "Client renders native components", from: "renderer", to: "ui" },
      { label: "User interacts → actions back to agent", from: "ui", to: "agent" },
    ],
    devWrites: `── What the developer provides ──
A component catalog (Card, Image, Text, etc.)
with native renderers for their platform
(Angular, Flutter, Lit, React…)

── What the agent generates (JSONL stream) ──

Line 1 → surfaceUpdate (component tree):
{
  "root": "hotel-card",
  "components": {
    "hotel-card": {
      "type": "Card",
      "props": { "title": { "$data": "/hotels/0/name" } },
      "children": ["hotel-image", "hotel-price"]
    },
    "hotel-image": {
      "type": "Image",
      "props": { "src": { "$data": "/hotels/0/imageUrl" } }
    }
  }
}

Line 2 → dataModelUpdate (state):
{
  "hotels": [{
    "name": "Hotel & Spa",
    "imageUrl": "/img/hotel.jpg",
    "price": "$240/night"
  }]
}

Line 3 → beginRendering
// Client renders native components with bound data`,
    tradeoffs: {
      strengths: [
        "Most portable — works across any frontend framework",
        "Built for multi-agent / untrusted agent scenarios",
        "Google-backed with active spec development",
        "Clean separation of structure and data via data binding",
      ],
      considerations: [
        "More ceremony to set up than a React-specific SDK",
        "Spec is still evolving (v0.8 stable, v0.9 draft)",
        "No built-in component library — you bring your own renderers",
        "Requires understanding the adjacency list model",
      ]
    }
  },
  openui: {
    name: "OpenUI Lang",
    by: "Thesys",
    tagline: "Token-efficient streaming language for generative UI",
    color: '#E86C3A',
    kind: "Compact Language + React Runtime",
    url: "https://openui.com",
    uiFormat: "OpenUI Lang (compact line-oriented function-call syntax)",
    renderers: "React (primary), React Native (planned)",
    llmGeneration: "Yes — custom language designed to minimize tokens",
    componentModel: "defineComponent + createLibrary with Zod schemas",
    stateBinding: "Props with Zod validation, library-driven",
    streaming: "Native — streaming-first language design",
    security: "Catalog-constrained, no arbitrary code execution",
    crossPlatform: "React (web), React Native planned",
    hosting: "Self-hosted (open source) or Thesys C1 API",
    trustModel: "Component library defines the guardrails",
    summary: "OpenUI's key innovation is a custom language that's not JSON — it's specifically designed to be token-efficient for LLM generation. They claim up to 67% fewer tokens than json-render. The developer defines a component library with Zod schemas, OpenUI generates the system prompt automatically, and the LLM responds in OpenUI Lang which the renderer parses and renders progressively.",
    dataFlow: [
      { label: "Developer defines component library", from: "dev", to: "library" },
      { label: "OpenUI generates system prompt from library", from: "library", to: "prompt" },
      { label: "User query + system prompt → LLM", from: "prompt", to: "llm" },
      { label: "LLM responds in OpenUI Lang tokens", from: "llm", to: "stream" },
      { label: "Parser processes compact syntax", from: "stream", to: "renderer" },
      { label: "Renderer maps to React components", from: "renderer", to: "ui" },
    ],
    devWrites: `── What the developer writes ──

// 1. Define components with Zod schemas
const HotelCard = defineComponent({
  name: "HotelCard",
  props: z.object({
    title: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().url(),
    ctaLabel: z.string(),
  }),
  component: ({ props }) => <HotelCard {...props} />,
})

// 2. Create a library (auto-generates system prompt)
const library = createLibrary({
  root: "Carousel",
  components: [Carousel, HotelCard],
})

── What the LLM responds with (OpenUI Lang) ──

// Compact, line-oriented, NOT JSON:
root = Carousel([c1, c2, c3])
c1 = HotelCard(
  "Hotel Plaza Athenee",
  "Haute couture suites; courtyard dining",
  "https://images.example.com/plaza.jpg",
  "Book"
)
c2 = HotelCard(
  "Four Seasons George V",
  "Landmark hotel with opulent rooms and spa.",
  "https://images.example.com/george-v.jpg",
  "Book"
)

// ~67% fewer tokens than the equivalent JSON`,
    tradeoffs: {
      strengths: [
        "Most token-efficient — up to 67% fewer tokens than JSON approaches",
        "Auto-generates system prompts from your component library",
        "Zod schema validation ensures type safety",
        "Streaming-first — renders progressively as tokens arrive",
      ],
      considerations: [
        "React-only currently (React Native planned)",
        "Custom syntax means tooling ecosystem is smaller",
        "Thesys (company) also has C1 hosted API — open-source vs hosted lines blur",
        "Newer project, smaller community",
      ]
    }
  },
  jsonrender: {
    name: "json-render",
    by: "Vercel",
    tagline: "JSON-based generative UI with code export",
    color: '#000000',
    kind: "JSON Schema + React Runtime",
    url: "https://json-render.dev",
    uiFormat: "JSON (flat element tree with catalog constraints)",
    renderers: "React, React Native",
    llmGeneration: "Yes — constrained JSON output",
    componentModel: "defineCatalog with Zod schemas, hasChildren slots",
    stateBinding: "$state, $item, $index, $bindState for two-way binding",
    streaming: "Yes — progressive JSON streaming",
    security: "Catalog-constrained, no arbitrary code execution",
    crossPlatform: "React (web), React Native",
    hosting: "Self-hosted (open source)",
    trustModel: "AI can only use components defined in the catalog",
    summary: "json-render is Vercel's take — pure JSON, heavily catalog-constrained, with a rich built-in component library (39 components, 6 actions). The standout feature is code export: you can eject any generated UI into standalone React code with no runtime dependency. It uses a flat element tree (not nested JSON) which is friendlier for streaming parsers.",
    dataFlow: [
      { label: "Developer defines catalog (components + actions)", from: "dev", to: "catalog" },
      { label: "Catalog schema sent as LLM system prompt", from: "catalog", to: "prompt" },
      { label: "User query → LLM generates constrained JSON", from: "prompt", to: "llm" },
      { label: "JSON streams progressively", from: "llm", to: "stream" },
      { label: "Renderer maps elements to React components", from: "stream", to: "renderer" },
      { label: "Components render with data binding", from: "renderer", to: "ui" },
    ],
    devWrites: `── What the developer writes ──

// 1. Define a catalog of allowed components + actions
const catalog = defineCatalog(schema, {
  components: {
    HotelCard: {
      props: z.object({
        title: z.string(),
        imageUrl: z.string(),
        price: z.string(),
      }),
      hasChildren: true,
    },
  },
  actions: {
    bookHotel: {
      params: z.object({ hotelId: z.string() })
    },
  },
});

── What the LLM generates (constrained JSON) ──

{
  "root": "card-1",
  "elements": {
    "card-1": {
      "type": "HotelCard",
      "props": {
        "title": "Hotel & Spa",
        "imageUrl": "/img/hotel.jpg",
        "price": "$240/night"
      },
      "children": ["book-btn"]
    },
    "book-btn": {
      "type": "Button",
      "props": { "label": "Book Now" },
      "on": { "press": {
        "action": "bookHotel",
        "params": { "hotelId": "123" }
      }}
    }
  }
}

// Can be exported as standalone React code`,
    tradeoffs: {
      strengths: [
        "Rich built-in component library (39 components out of the box)",
        "Code export — eject to standalone React, no runtime needed",
        "Mature data binding with $state, $bindState, $item",
        "Backed by Vercel — strong ecosystem alignment",
      ],
      considerations: [
        "More tokens than OpenUI Lang (JSON is verbose)",
        "React/React Native only",
        "Flat element tree can feel unfamiliar vs nested JSX",
        "11k GitHub stars but relatively new",
      ]
    }
  },
  tambo: {
    name: "Tambo",
    by: "Fractal Dynamics",
    tagline: "Full-stack agent toolkit for React",
    color: '#6C5CE7',
    kind: "Full-Stack SDK + Hosted Platform",
    url: "https://tambo.co",
    uiFormat: "React components registered via TamboProvider",
    renderers: "React",
    llmGeneration: "Yes — agent selects and populates registered components",
    componentModel: "Register existing React components with Zod schemas",
    stateBinding: "Built-in component state management + useTamboState",
    streaming: "Yes — streaming component rendering",
    security: "Agent only renders registered components",
    crossPlatform: "React (web)",
    hosting: "Cloud hosted (free tier) or self-hosted open source",
    trustModel: "Agent inherits user's auth permissions",
    mcpSupport: "Built-in MCP support",
    summary: "Tambo is the most batteries-included option. It's not just a UI spec — it's a full agent platform. You wrap your React app in a TamboProvider, register your existing components, and Tambo handles the agent runtime, streaming, state management, conversation storage, auth, and MCP integration. It has a hosted cloud service with pricing tiers, but the core is open source and self-hostable.",
    dataFlow: [
      { label: "Developer wraps app in TamboProvider", from: "dev", to: "provider" },
      { label: "Register existing React components", from: "provider", to: "registry" },
      { label: "User message → Tambo cloud agent", from: "user", to: "agent" },
      { label: "Agent selects component + generates props", from: "agent", to: "stream" },
      { label: "Tambo streams component with state", from: "stream", to: "renderer" },
      { label: "Your styled component renders", from: "renderer", to: "ui" },
      { label: "User interaction → state update → agent", from: "ui", to: "agent" },
    ],
    devWrites: `── What the developer writes ──

// 1. Register your EXISTING components
const components = [
  {
    name: "HotelCard",
    description: "Displays a hotel with booking",
    component: HotelCard,  // your component!
    propsSchema: z.object({
      name: z.string(),
      imageUrl: z.string(),
      price: z.string(),
      rating: z.number(),
    }),
  },
];

// 2. Wrap your app — that's it
function App() {
  return (
    <TamboProvider
      apiKey="your-key"
      components={components}
    >
      <YourApp />
      <TamboChat />
    </TamboProvider>
  );
}

── What happens at runtime ──

// User: "Find me a hotel in Paris"
// → Tambo agent selects HotelCard
// → Streams props to your component
// → Your component renders with YOUR styling
// → User interactions flow back to agent
// Auth, MCP, conversation storage: all built in`,
    tradeoffs: {
      strengths: [
        "Fastest time-to-working-demo — minutes, not days",
        "Uses your existing React components as-is",
        "Built-in auth, conversation storage, MCP, analytics",
        "Open source core + managed cloud option",
      ],
      considerations: [
        "React-only (no cross-platform story)",
        "Cloud dependency for managed features (or self-host)",
        "Hosted service has pricing tiers ($25/mo for growth)",
        "Less control over the agent layer vs building your own",
      ]
    }
  },
};

const DIMENSIONS = [
  { key: 'kind', label: 'What It Is' },
  { key: 'uiFormat', label: 'UI Format' },
  { key: 'renderers', label: 'Renderers' },
  { key: 'streaming', label: 'Streaming' },
  { key: 'crossPlatform', label: 'Cross-Platform' },
  { key: 'security', label: 'Security Model' },
  { key: 'hosting', label: 'Hosting' },
  { key: 'trustModel', label: 'Trust Model' },
];

// ---- Components ----

function DataFlowDiagram({ framework }) {
  const fw = FRAMEWORKS[framework];
  const steps = fw.dataFlow;
  
  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: fw.color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.75rem', fontWeight: 600,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <div style={{
              flex: 1, padding: '0.5rem 0.75rem',
              background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
              borderRadius: 6,
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: '0.9rem',
              color: COLORS.warmBlack,
              lineHeight: 1.4,
            }}>
              {step.label}
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.65rem',
              color: COLORS.dusk,
              opacity: 0.7,
              flexShrink: 0,
              width: 80,
              textAlign: 'right',
            }}>
              {step.from} → {step.to}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Syntax highlighting theme — warm Manzanita tones on dark
const SYN = {
  bg: '#1a1917',
  gutterBg: '#1f1e1c',
  headerBg: '#222120',
  border: '#333230',
  default: '#d4d0c8',
  comment: '#7a7568',
  section: '#C2714F',    // terracotta — section headers
  string: '#8B9E7E',     // sage — strings
  number: '#C49A3C',     // ochre — numbers
  keyword: '#c9956b',    // warm gold — keywords
  property: '#b8a89a',   // warm stone — property names
  punctuation: '#6b6560', // muted — brackets, braces
  tag: '#C2714F',        // terracotta — JSX tags
  attr: '#9B8EA8',       // lavender — attributes
  operator: '#8a8078',   // warm gray — operators, arrows
  bool: '#C49A3C',       // ochre — true/false/null
};

function highlightCode(code) {
  const lines = code.split('\n');
  return lines.map((line, lineIdx) => {
    // Section headers (── ... ──)
    if (line.match(/^──.*──$/)) {
      return { line: lineIdx, tokens: [{ text: line, color: SYN.section, bold: true }] };
    }
    // Full-line comments
    if (line.trimStart().startsWith('//')) {
      return { line: lineIdx, tokens: [{ text: line, color: SYN.comment, italic: true }] };
    }
    // Line-level tokenization
    const tokens = [];
    let remaining = line;
    let pos = 0;
    while (remaining.length > 0) {
      let match;
      // Inline comment at end
      if ((match = remaining.match(/^(\/\/.*)/))) {
        tokens.push({ text: match[1], color: SYN.comment, italic: true });
        remaining = remaining.slice(match[1].length);
      }
      // Strings (double-quoted)
      else if ((match = remaining.match(/^("(?:[^"\\]|\\.)*")/))) {
        tokens.push({ text: match[1], color: SYN.string });
        remaining = remaining.slice(match[1].length);
      }
      // Strings (single-quoted)
      else if ((match = remaining.match(/^('(?:[^'\\]|\\.)*')/))) {
        tokens.push({ text: match[1], color: SYN.string });
        remaining = remaining.slice(match[1].length);
      }
      // JSX-like tags: <ComponentName or </ComponentName or />
      else if ((match = remaining.match(/^(<\/?[A-Z][A-Za-z]*)/))) {
        tokens.push({ text: match[1], color: SYN.tag, bold: true });
        remaining = remaining.slice(match[1].length);
      }
      // Closing >  or />
      else if ((match = remaining.match(/^(\/>|>)/))) {
        tokens.push({ text: match[1], color: SYN.tag });
        remaining = remaining.slice(match[1].length);
      }
      // Keywords
      else if ((match = remaining.match(/^(const|let|var|function|return|new|typeof|class)\b/))) {
        tokens.push({ text: match[1], color: SYN.keyword, bold: true });
        remaining = remaining.slice(match[1].length);
      }
      // Boolean / null / undefined
      else if ((match = remaining.match(/^(true|false|null|undefined)\b/))) {
        tokens.push({ text: match[1], color: SYN.bool });
        remaining = remaining.slice(match[1].length);
      }
      // Numbers (including negatives and decimals)
      else if ((match = remaining.match(/^(-?\d+\.?\d*)/))) {
        tokens.push({ text: match[1], color: SYN.number });
        remaining = remaining.slice(match[1].length);
      }
      // Property keys before colon: "key": or key:
      else if ((match = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/))) {
        tokens.push({ text: match[1], color: SYN.property });
        tokens.push({ text: match[2], color: SYN.punctuation });
        remaining = remaining.slice(match[0].length);
      }
      // JSX attribute names (word followed by =)
      else if ((match = remaining.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)(\s*=)/))) {
        tokens.push({ text: match[1], color: SYN.attr });
        tokens.push({ text: match[2], color: SYN.operator });
        remaining = remaining.slice(match[0].length);
      }
      // Arrow =>
      else if ((match = remaining.match(/^(=>)/))) {
        tokens.push({ text: match[1], color: SYN.operator });
        remaining = remaining.slice(match[1].length);
      }
      // Brackets and braces
      else if ((match = remaining.match(/^([{}[\]().,;])/))) {
        tokens.push({ text: match[1], color: SYN.punctuation });
        remaining = remaining.slice(1);
      }
      // $-prefixed (like $data, $state)
      else if ((match = remaining.match(/^(\$[a-zA-Z_]+)/))) {
        tokens.push({ text: match[1], color: SYN.tag });
        remaining = remaining.slice(match[1].length);
      }
      // z.something()
      else if ((match = remaining.match(/^(z\.[a-zA-Z]+)/))) {
        tokens.push({ text: match[1], color: SYN.keyword });
        remaining = remaining.slice(match[1].length);
      }
      // Line N → label (data flow annotations)
      else if ((match = remaining.match(/^(Line \d+\s*→\s*\w+)/))) {
        tokens.push({ text: match[1], color: SYN.section, bold: true });
        remaining = remaining.slice(match[1].length);
      }
      // Default: single character
      else {
        tokens.push({ text: remaining[0], color: SYN.default });
        remaining = remaining.slice(1);
      }
    }
    return { line: lineIdx, tokens };
  });
}

function CodeBlock({ code, framework }) {
  const fw = FRAMEWORKS[framework];
  const highlighted = highlightCode(code);

  return (
    <div style={{
      background: SYN.bg,
      borderRadius: 8,
      overflow: 'hidden',
      border: `1px solid ${SYN.border}`,
    }}>
      <div style={{
        padding: '0.5rem 0.75rem',
        background: SYN.headerBg,
        borderBottom: `1px solid ${SYN.border}`,
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: fw.color }} />
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.7rem', color: '#888',
        }}>
          {fw.name} — developer experience
        </span>
      </div>
      <div style={{
        overflowX: 'auto',
        padding: '1rem 0',
      }}>
        {highlighted.map(({ line, tokens }) => (
          <div key={line} style={{
            display: 'flex',
            minHeight: '1.5em',
            lineHeight: '1.55',
          }}>
            <span style={{
              display: 'inline-block',
              width: 40,
              textAlign: 'right',
              paddingRight: 12,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.68rem',
              color: '#4a4640',
              userSelect: 'none',
              flexShrink: 0,
            }}>
              {line + 1}
            </span>
            <code style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.75rem',
              whiteSpace: 'pre',
              paddingRight: '1rem',
            }}>
              {tokens.map((t, i) => (
                <span key={i} style={{
                  color: t.color,
                  fontWeight: t.bold ? 600 : 400,
                  fontStyle: t.italic ? 'italic' : 'normal',
                }}>
                  {t.text}
                </span>
              ))}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

function TradeoffCard({ framework }) {
  const fw = FRAMEWORKS[framework];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div style={{
        padding: '1rem',
        background: `${COLORS.sage}11`,
        borderRadius: 8,
        borderLeft: `3px solid ${COLORS.sage}`,
      }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 600,
          fontSize: '0.85rem',
          color: COLORS.sage,
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}>
          Strengths
        </div>
        {fw.tradeoffs.strengths.map((s, i) => (
          <div key={i} style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '0.85rem',
            color: COLORS.warmBlack,
            lineHeight: 1.5,
            padding: '0.25rem 0',
            borderBottom: i < fw.tradeoffs.strengths.length - 1 ? `1px solid ${COLORS.fog}` : 'none',
          }}>
            {s}
          </div>
        ))}
      </div>
      <div style={{
        padding: '1rem',
        background: `${COLORS.ochre}11`,
        borderRadius: 8,
        borderLeft: `3px solid ${COLORS.ochre}`,
      }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontWeight: 600,
          fontSize: '0.85rem',
          color: COLORS.ochre,
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}>
          Considerations
        </div>
        {fw.tradeoffs.considerations.map((s, i) => (
          <div key={i} style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: '0.85rem',
            color: COLORS.warmBlack,
            lineHeight: 1.5,
            padding: '0.25rem 0',
            borderBottom: i < fw.tradeoffs.considerations.length - 1 ? `1px solid ${COLORS.fog}` : 'none',
          }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function FrameworkTab({ id, active, onClick }) {
  const fw = FRAMEWORKS[id];
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.6rem 1.2rem',
        border: active ? `2px solid ${fw.color}` : `1px solid ${COLORS.fog}`,
        borderRadius: 8,
        background: active ? `${fw.color}0D` : COLORS.cream,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.15rem',
        transition: 'all 0.2s ease',
        minWidth: 140,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: fw.color,
        }} />
      )}
      <span style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontWeight: 600,
        fontSize: '1rem',
        color: active ? fw.color : COLORS.warmBlack,
        letterSpacing: '-0.03em',
        fontVariationSettings: "'WONK' 1, 'SOFT' 100",
      }}>
        {fw.name}
      </span>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.65rem',
        color: COLORS.dusk,
      }}>
        {fw.by}
      </span>
    </button>
  );
}

function ComparisonTable() {
  const fwKeys = Object.keys(FRAMEWORKS);
  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: 8,
      border: `1px solid ${COLORS.fog}`,
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: '0.82rem',
      }}>
        <thead>
          <tr>
            <th style={{
              textAlign: 'left', padding: '0.75rem 1rem',
              background: COLORS.fog,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.7rem',
              color: COLORS.dusk,
              fontWeight: 500,
              borderBottom: `2px solid ${COLORS.warmBlack}20`,
              position: 'sticky', left: 0,
              minWidth: 120,
            }}>
              Dimension
            </th>
            {fwKeys.map(k => (
              <th key={k} style={{
                textAlign: 'left', padding: '0.75rem 1rem',
                background: COLORS.fog,
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600, fontSize: '0.9rem',
                color: FRAMEWORKS[k].color,
                letterSpacing: '-0.02em',
                fontVariationSettings: "'WONK' 1, 'SOFT' 100",
                borderBottom: `2px solid ${FRAMEWORKS[k].color}40`,
                minWidth: 160,
              }}>
                {FRAMEWORKS[k].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DIMENSIONS.map((dim, i) => (
            <tr key={dim.key} style={{
              background: i % 2 === 0 ? 'transparent' : `${COLORS.fog}44`,
            }}>
              <td style={{
                padding: '0.6rem 1rem',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.7rem',
                color: COLORS.bark,
                fontWeight: 600,
                borderBottom: `1px solid ${COLORS.fog}`,
                position: 'sticky', left: 0,
                background: i % 2 === 0 ? COLORS.cream : `${COLORS.fog}88`,
              }}>
                {dim.label}
              </td>
              {fwKeys.map(k => (
                <td key={k} style={{
                  padding: '0.6rem 1rem',
                  color: COLORS.warmBlack,
                  lineHeight: 1.4,
                  borderBottom: `1px solid ${COLORS.fog}`,
                }}>
                  {FRAMEWORKS[k][dim.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpectrumBar() {
  const items = [
    { id: 'a2ui', label: 'A2UI', pos: 5 },
    { id: 'openui', label: 'OpenUI', pos: 35 },
    { id: 'jsonrender', label: 'json-render', pos: 55 },
    { id: 'tambo', label: 'Tambo', pos: 90 },
  ];
  
  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontWeight: 600, fontSize: '1.1rem',
        color: COLORS.warmBlack,
        letterSpacing: '-0.03em',
        marginBottom: '1.5rem',
        fontVariationSettings: "'WONK' 1, 'SOFT' 100",
      }}>
        The Spectrum: Protocol → Platform
      </div>
      <div style={{ position: 'relative', height: 100, marginBottom: '0.5rem' }}>
        {/* Track */}
        <div style={{
          position: 'absolute', top: 40, left: 0, right: 0, height: 4,
          background: `linear-gradient(to right, ${COLORS.bark}, ${COLORS.terracotta}, ${COLORS.ochre}, ${COLORS.lavenderDried})`,
          borderRadius: 2,
        }} />
        {/* Markers */}
        {items.map(item => (
          <div key={item.id} style={{
            position: 'absolute',
            left: `${item.pos}%`,
            top: 0,
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600, fontSize: '0.85rem',
              color: FRAMEWORKS[item.id].color,
              letterSpacing: '-0.02em',
              marginBottom: 6,
              fontVariationSettings: "'WONK' 1, 'SOFT' 100",
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </div>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: FRAMEWORKS[item.id].color,
              border: `2px solid ${COLORS.cream}`,
              boxShadow: `0 0 0 1px ${FRAMEWORKS[item.id].color}40`,
            }} />
          </div>
        ))}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.65rem',
        color: COLORS.dusk,
        marginTop: '0.75rem',
      }}>
        <span>← Pure spec / BYO everything</span>
        <span>Batteries included / managed →</span>
      </div>
    </div>
  );
}

function SectionHeader({ children, sub }) {
  return (
    <div style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>
      <h2 style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontWeight: 600,
        fontSize: '1.5rem',
        color: COLORS.warmBlack,
        letterSpacing: '-0.04em',
        lineHeight: 1.1,
        margin: 0,
        fontVariationSettings: "'WONK' 1, 'SOFT' 100",
      }}>
        {children}
      </h2>
      {sub && (
        <p style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: '0.95rem',
          color: COLORS.dusk,
          lineHeight: 1.6,
          marginTop: '0.4rem',
          maxWidth: '42rem',
        }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function ViewToggle({ view, setView }) {
  const views = [
    { id: 'overview', label: 'Overview' },
    { id: 'deep-dive', label: 'Deep Dive' },
    { id: 'comparison', label: 'Side by Side' },
  ];
  return (
    <div style={{
      display: 'flex', gap: '0.25rem',
      background: COLORS.fog,
      padding: 3, borderRadius: 8,
    }}>
      {views.map(v => (
        <button key={v.id} onClick={() => setView(v.id)} style={{
          padding: '0.4rem 0.8rem',
          borderRadius: 6, border: 'none',
          background: view === v.id ? COLORS.cream : 'transparent',
          color: view === v.id ? COLORS.warmBlack : COLORS.dusk,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.75rem',
          fontWeight: view === v.id ? 600 : 400,
          cursor: 'pointer',
          boxShadow: view === v.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.15s ease',
        }}>
          {v.label}
        </button>
      ))}
    </div>
  );
}

// ---- Main App ----

export default function GenUIExplorer() {
  const [activeFramework, setActiveFramework] = useState('a2ui');
  const [view, setView] = useState('overview');
  const fwKeys = Object.keys(FRAMEWORKS);
  const fw = FRAMEWORKS[activeFramework];

  return (
    <div style={{
      background: COLORS.cream,
      minHeight: '100vh',
      fontFamily: "'Source Serif 4', Georgia, serif",
    }}>
      {/* Grain overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.7rem',
            color: COLORS.terracotta,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '0.5rem',
          }}>
            Manzanita Research
          </div>
          <h1 style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 600,
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            color: COLORS.warmBlack,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            margin: 0,
            fontVariationSettings: "'WONK' 1, 'SOFT' 100",
          }}>
            Generative UI Frameworks,<br />Explored
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: COLORS.dusk,
            lineHeight: 1.7,
            marginTop: '0.75rem',
            maxWidth: '38rem',
          }}>
            Four frameworks. One question. How should an AI agent describe a user interface?
            This is a visual guide to the emerging generative UI landscape — 
            how each approach works, where they differ, and which tradeoffs they make.
          </p>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.72rem',
            color: COLORS.dusk,
            opacity: 0.7,
            marginTop: '0.3rem',
          }}>
            Like <a href="https://todomvc.com" target="_blank" rel="noopener" style={{ color: COLORS.bark }}>TodoMVC</a>, but for the age of agents.
          </p>
        </div>

        {/* Spectrum */}
        <SpectrumBar />

        <div style={{ borderBottom: `1px solid ${COLORS.fog}`, margin: '0.5rem 0 1.5rem' }} />

        {/* View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <ViewToggle view={view} setView={setView} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.65rem',
            color: COLORS.dusk,
          }}>
            Spring 2026
          </div>
        </div>

        {/* ---- OVERVIEW VIEW ---- */}
        {view === 'overview' && (
          <div>
            <SectionHeader sub="Each framework lives at a different point on the protocol-to-platform spectrum. Here's the lay of the land.">
              The Landscape
            </SectionHeader>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {fwKeys.map(k => {
                const f = FRAMEWORKS[k];
                return (
                  <div key={k} onClick={() => { setActiveFramework(k); setView('deep-dive'); }} style={{
                    padding: '1.25rem',
                    border: `1px solid ${COLORS.fog}`,
                    borderRadius: 10,
                    borderTop: `3px solid ${f.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: COLORS.cream,
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.boxShadow = `0 4px 16px ${f.color}15`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                  }}>
                    <div style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontWeight: 600, fontSize: '1.15rem',
                      color: f.color,
                      letterSpacing: '-0.03em',
                      fontVariationSettings: "'WONK' 1, 'SOFT' 100",
                    }}>
                      {f.name}
                    </div>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.65rem', color: COLORS.dusk,
                      marginBottom: '0.5rem',
                    }}>
                      {f.by} · <a href={f.url} target="_blank" rel="noopener" style={{ color: COLORS.bark }} onClick={e => e.stopPropagation()}>site ↗</a>
                    </div>
                    <div style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.7rem',
                      color: COLORS.terracotta,
                      padding: '0.2rem 0.5rem',
                      background: `${COLORS.terracotta}0D`,
                      borderRadius: 4,
                      display: 'inline-block',
                      marginBottom: '0.5rem',
                    }}>
                      {f.kind}
                    </div>
                    <p style={{
                      fontSize: '0.85rem',
                      color: COLORS.warmBlack,
                      lineHeight: 1.5,
                      margin: 0,
                    }}>
                      {f.tagline}
                    </p>
                  </div>
                );
              })}
            </div>

            <SectionHeader sub="The same question — 'Find me a hotel in Paris' — handled by each framework. What does the developer write? How does data flow?">
              One Query, Four Architectures
            </SectionHeader>

            <p style={{
              fontSize: '0.95rem', color: COLORS.warmBlack, lineHeight: 1.7,
              maxWidth: '38rem', marginBottom: '1.5rem',
            }}>
              Click any framework to explore its data flow and developer experience in detail.
            </p>

            {/* Framework tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {fwKeys.map(k => (
                <FrameworkTab
                  key={k} id={k}
                  active={activeFramework === k}
                  onClick={() => setActiveFramework(k)}
                />
              ))}
            </div>

            {/* Active framework detail */}
            <div style={{
              border: `1px solid ${COLORS.fog}`,
              borderRadius: 10,
              overflow: 'hidden',
              borderTop: `3px solid ${fw.color}`,
            }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 600, fontSize: '1.2rem',
                  color: fw.color,
                  letterSpacing: '-0.03em',
                  fontVariationSettings: "'WONK' 1, 'SOFT' 100",
                  marginBottom: '0.5rem',
                }}>
                  Data Flow: {fw.name}
                </div>
                <DataFlowDiagram framework={activeFramework} />
              </div>
              <div style={{
                borderTop: `1px solid ${COLORS.fog}`,
                padding: '1.5rem',
                background: `${COLORS.fog}33`,
              }}>
                <div style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 600, fontSize: '1rem',
                  color: COLORS.warmBlack,
                  letterSpacing: '-0.02em',
                  marginBottom: '0.75rem',
                  fontVariationSettings: "'WONK' 1, 'SOFT' 100",
                }}>
                  Developer Experience
                </div>
                <CodeBlock code={fw.devWrites} framework={activeFramework} />
              </div>
            </div>
          </div>
        )}

        {/* ---- DEEP DIVE VIEW ---- */}
        {view === 'deep-dive' && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {fwKeys.map(k => (
                <FrameworkTab
                  key={k} id={k}
                  active={activeFramework === k}
                  onClick={() => setActiveFramework(k)}
                />
              ))}
            </div>

            <div style={{
              padding: '1.5rem',
              border: `1px solid ${COLORS.fog}`,
              borderRadius: 10,
              borderLeft: `4px solid ${fw.color}`,
              marginBottom: '1.5rem',
            }}>
              <div style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600, fontSize: '1.6rem',
                color: fw.color,
                letterSpacing: '-0.04em',
                fontVariationSettings: "'WONK' 1, 'SOFT' 100",
              }}>
                {fw.name}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.7rem', color: COLORS.dusk,
                marginBottom: '0.75rem',
              }}>
                {fw.by} · {fw.kind} · <a href={fw.url} target="_blank" rel="noopener" style={{ color: COLORS.bark }}>{fw.url.replace('https://', '')} ↗</a>
              </div>
              <p style={{
                fontSize: '0.95rem',
                color: COLORS.warmBlack,
                lineHeight: 1.7,
                margin: 0,
                maxWidth: '42rem',
              }}>
                {fw.summary}
              </p>
            </div>

            <SectionHeader>Data Flow</SectionHeader>
            <div style={{
              border: `1px solid ${COLORS.fog}`, borderRadius: 10,
              padding: '1.25rem', marginBottom: '1.5rem',
            }}>
              <DataFlowDiagram framework={activeFramework} />
            </div>

            <SectionHeader>What You Write</SectionHeader>
            <CodeBlock code={fw.devWrites} framework={activeFramework} />

            <SectionHeader>Tradeoffs</SectionHeader>
            <TradeoffCard framework={activeFramework} />
          </div>
        )}

        {/* ---- COMPARISON VIEW ---- */}
        {view === 'comparison' && (
          <div>
            <SectionHeader sub="Every dimension, all four frameworks. Scroll horizontally if needed.">
              Side-by-Side Comparison
            </SectionHeader>
            <ComparisonTable />

            <SectionHeader sub="A key architectural question: do these frameworks share a common idea, or are they solving different problems?">
              The Shared Pattern
            </SectionHeader>
            <div style={{
              padding: '1.5rem',
              background: `${COLORS.bark}08`,
              border: `1px solid ${COLORS.bark}20`,
              borderRadius: 10,
              marginBottom: '1.5rem',
            }}>
              <p style={{
                fontSize: '0.95rem', color: COLORS.warmBlack, lineHeight: 1.7,
                margin: 0, maxWidth: '42rem',
              }}>
                Despite their differences, all four frameworks share a core architectural insight: 
                <strong style={{ color: COLORS.bark }}> the LLM should select and populate components from a pre-defined catalog, not generate arbitrary UI code.</strong>
              </p>
              <p style={{
                fontSize: '0.95rem', color: COLORS.warmBlack, lineHeight: 1.7,
                margin: '0.75rem 0 0', maxWidth: '42rem',
              }}>
                They all use some form of schema (usually Zod) to define what's allowed, 
                they all support streaming, and they all reject the idea of letting an LLM 
                write raw HTML/JSX. Where they diverge is in how they encode the UI description
                (JSONL vs. compact language vs. JSON vs. React props), how much infrastructure 
                they bundle, and which trust boundaries they're designed for.
              </p>
            </div>

            <SectionHeader>When to Use What</SectionHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {fwKeys.map(k => {
                const f = FRAMEWORKS[k];
                return (
                  <div key={k} style={{
                    padding: '1rem',
                    border: `1px solid ${COLORS.fog}`,
                    borderRadius: 8,
                    borderTop: `3px solid ${f.color}`,
                  }}>
                    <div style={{
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontWeight: 600, fontSize: '1rem',
                      color: f.color,
                      letterSpacing: '-0.02em',
                      fontVariationSettings: "'WONK' 1, 'SOFT' 100",
                      marginBottom: '0.4rem',
                    }}>
                      Choose {f.name} when…
                    </div>
                    <div style={{ fontSize: '0.85rem', color: COLORS.warmBlack, lineHeight: 1.6 }}>
                      {k === 'a2ui' && "You need cross-platform rendering (not just React), you're building for multi-agent systems with untrusted agents, or you want a framework-agnostic protocol that works with Angular, Flutter, and native apps."}
                      {k === 'openui' && "Token efficiency matters (high-volume, cost-sensitive), you want automatic prompt generation from your component library, and you're building in React with a streaming-first architecture."}
                      {k === 'jsonrender' && "You want a rich built-in component library, the ability to export generated UI as standalone React code, or you're in the Vercel/Next.js ecosystem and want strong data binding patterns."}
                      {k === 'tambo' && "You want the fastest path from zero to working agent UI, you need auth + conversation storage + MCP out of the box, or you prefer a managed platform with self-host escape hatch."}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${COLORS.fog}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600, fontSize: '0.9rem',
              color: COLORS.bark,
              letterSpacing: '-0.02em',
              fontVariationSettings: "'WONK' 1, 'SOFT' 100",
            }}>
              Manzanita Research
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.65rem',
              color: COLORS.dusk,
              marginTop: '0.2rem',
            }}>
              An independent AI lab building tools for creatives.
            </div>
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.65rem',
            color: COLORS.dusk,
          }}>
            Spring 2026 · Not affiliated with any listed framework
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        a { text-decoration: none; }
        a:hover { text-decoration: underline; }
        pre::-webkit-scrollbar { height: 6px; }
        pre::-webkit-scrollbar-track { background: #222; }
        pre::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
        table::-webkit-scrollbar { height: 6px; }
        table::-webkit-scrollbar-track { background: ${COLORS.fog}; }
        table::-webkit-scrollbar-thumb { background: ${COLORS.dusk}50; border-radius: 3px; }
      `}</style>
    </div>
  );
}
