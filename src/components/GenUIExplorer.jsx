import { useState, useRef, useEffect } from "react";

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

const SAMPLE_HOTELS = [
  {
    id: 'hotel-1',
    name: 'The Marker',
    neighborhood: 'Union Square',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop',
    price: 289,
    rating: 4.6,
    nights: 3,
  },
  {
    id: 'hotel-2',
    name: 'Hotel Kabuki',
    neighborhood: 'Japantown',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop',
    price: 215,
    rating: 4.4,
    nights: 3,
  },
  {
    id: 'hotel-3',
    name: 'The Battery',
    neighborhood: 'Financial District',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop',
    price: 342,
    rating: 4.8,
    nights: 3,
  },
];

const FLOW_NODES = {
  user: { label: 'User' },
  designSystem: { label: 'Your Components' },
  registry: { label: 'Component Registry' },
  llm: { label: 'LLM' },
  stream: { label: 'Stream' },
  parser: { label: 'Parser' },
  renderer: { label: 'Renderer' },
  ui: { label: 'Rendered UI' },
  agent: { label: 'Agent' },
  cloud: { label: 'Cloud Agent' },
};

function HotelCard({ name, neighborhood, imageUrl, price, rating, nights, onBook }) {
  return (
    <div style={{
      border: `1px solid ${COLORS.fog}`,
      borderRadius: 10,
      overflow: 'hidden',
      background: '#fff',
      transition: 'box-shadow 0.2s ease',
    }}>
      <div style={{
        width: '100%',
        height: 160,
        background: `url(${imageUrl}) center/cover`,
        borderBottom: `1px solid ${COLORS.fog}`,
      }} />
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontWeight: 600, fontSize: '1rem',
            color: COLORS.warmBlack,
            letterSpacing: '-0.02em',
          }}>
            {name}
          </div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.7rem', color: COLORS.ochre,
          }}>
            {rating}
          </div>
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.7rem', color: COLORS.dusk,
          marginBottom: '0.75rem',
        }}>
          {neighborhood}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600, fontSize: '1.1rem',
              color: COLORS.warmBlack,
            }}>
              ${price}
            </span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.65rem', color: COLORS.dusk,
            }}>
              {' '}/night · {nights} nights = ${price * nights}
            </span>
          </div>
          <button
            onClick={() => onBook?.()}
            style={{
              padding: '0.4rem 1rem',
              background: COLORS.terracotta,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

function HotelGrid({ hotels }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '1rem',
    }}>
      {hotels.map(hotel => (
        <HotelCard key={hotel.id} {...hotel} />
      ))}
    </div>
  );
}

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
    renderers: "Angular, Flutter, Lit/Web Components (stable); React (in progress)",
    llmGeneration: "Yes — designed for streaming LLM output",
    componentModel: "Declarative blueprints from a catalog",
    stateBinding: "Data binding via path references (JSON Pointer) to a shared data model",
    streaming: "Native — JSONL line-by-line",
    security: "Declarative data, no code execution",
    crossPlatform: "Angular, Flutter, Lit/Web Components (stable); React, SwiftUI, Vue (planned)",
    hosting: "Self-hosted (open spec)",
    trustModel: "Designed for untrusted agents across trust boundaries",
    summary: "A2UI is the most protocol-oriented approach. It's a specification, not a library — think of it like HTML for agent UIs. Agents send declarative component descriptions as streaming JSONL, and any renderer can interpret them. The key insight is trust boundaries: A2UI is designed for scenarios where the agent generating UI is not controlled by the app developer. Note: v0.8 (stable) and v0.9 (draft, Q1 2026) are significantly different — v0.9 renames message types (surfaceUpdate → updateComponents, beginRendering → createSurface), flattens the component structure, and switches to plain JSON for data models. The examples here show v0.8, the current stable spec.",
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
(Angular, Flutter, Lit, Web Components…)

── What the agent generates (JSONL stream) ──

Line 1 → surfaceUpdate (component tree):
{
  "surfaceUpdate": {
    "surfaceId": "main",
    "components": [
      {
        "id": "hotel-card",
        "component": {
          "Card": {
            "child": "hotel-content"
          }
        }
      },
      {
        "id": "hotel-content",
        "component": {
          "Column": {
            "children": {
              "explicitList": ["hotel-image", "hotel-price"]
            }
          }
        }
      },
      {
        "id": "hotel-image",
        "component": {
          "Image": {
            "src": { "path": "/hotels/0/imageUrl" }
          }
        }
      },
      {
        "id": "hotel-price",
        "component": {
          "Text": {
            "text": { "path": "/hotels/0/price" }
          }
        }
      }
    ]
  }
}

Line 2 → dataModelUpdate (state):
{
  "dataModelUpdate": {
    "surfaceId": "main",
    "contents": [
      {
        "key": "hotels",
        "valueList": [
          {
            "valueMap": [
              { "key": "name", "valueString": "Hotel & Spa" },
              { "key": "imageUrl", "valueString": "/img/hotel.jpg" },
              { "key": "price", "valueString": "$240/night" }
            ]
          }
        ]
      }
    ]
  }
}

Line 3 → beginRendering:
{ "beginRendering": { "surfaceId": "main", "root": "hotel-card" } }
// Client renders native components with bound data`,
    tradeoffs: {
      strengths: [
        "Most portable — Angular, Flutter, Lit stable; React, SwiftUI, Vue planned",
        "Built for multi-agent / untrusted agent scenarios",
        "Google-backed with active spec development (Apache 2.0)",
        "Clean separation of structure and data via JSON Pointer binding",
      ],
      considerations: [
        "More ceremony to set up than a React-specific SDK",
        "Spec is still evolving (v0.8 stable, v0.9 draft); React renderer not yet shipped",
        "No built-in component library — you bring your own renderers",
        "Requires understanding the adjacency list model and four message types",
      ]
    },
    componentDefinition: `── Your design system components ──
// These exist already — your HotelCard, your styles
function HotelCard({ name, neighborhood, imageUrl, price, rating, nights, onBook }) {
  return <Card>…your styled component…</Card>
}

── Registering with A2UI ──
// Map A2UI component names to your renderers
const rendererCatalog = {
  "HotelCard": (props, dataModel) => (
    <HotelCard
      name={resolveBinding(props.name, dataModel)}
      price={resolveBinding(props.price, dataModel)}
      imageUrl={resolveBinding(props.imageUrl, dataModel)}
      rating={resolveBinding(props.rating, dataModel)}
      neighborhood={resolveBinding(props.neighborhood, dataModel)}
      nights={resolveBinding(props.nights, dataModel)}
      onBook={() => sendAction("bookHotel", {
        hotelId: resolveBinding(props.hotelId, dataModel)
      })}
    />
  ),
  "HotelGrid": (props, children) => (
    <HotelGrid>{children}</HotelGrid>
  ),
}

// Data bindings use JSON Pointer paths
// e.g. { "path": "/hotels/0/name" } → resolved at render time`,
    wireFormat: `── A2UI Wire Format (JSONL stream) ──

// Line 1: Component tree
{"surfaceUpdate":{"surfaceId":"main","components":[
  {"id":"grid","component":{"HotelGrid":{
    "children":{"explicitList":["c1","c2","c3"]}}}},
  {"id":"c1","component":{"HotelCard":{
    "name":{"path":"/hotels/0/name"},
    "price":{"path":"/hotels/0/price"},
    "imageUrl":{"path":"/hotels/0/imageUrl"},
    "rating":{"path":"/hotels/0/rating"},
    "neighborhood":{"path":"/hotels/0/neighborhood"},
    "nights":{"path":"/query/nights"},
    "onBook":{"action":"bookHotel",
      "params":{"hotelId":{"path":"/hotels/0/id"}}}
  }}},
  {"id":"c2","component":{"HotelCard":{...}}},
  {"id":"c3","component":{"HotelCard":{...}}}
]}}

// Line 2: Data model (state)
{"dataModelUpdate":{"surfaceId":"main","contents":[
  {"key":"query","valueMap":[
    {"key":"nights","valueString":"3"}]},
  {"key":"hotels","valueList":[
    {"valueMap":[
      {"key":"id","valueString":"hotel-1"},
      {"key":"name","valueString":"The Marker"},
      {"key":"neighborhood","valueString":"Union Square"},
      {"key":"price","valueString":"289"},
      {"key":"rating","valueString":"4.6"},
      {"key":"imageUrl","valueString":"https://..."}
    ]},
    ...
  ]}
]}}

// Line 3: Render signal
{"beginRendering":{"surfaceId":"main","root":"grid"}}

// Action from user click:
{"action":"bookHotel","params":{"hotelId":"hotel-1"}}`,
    pipelineSteps: [
      {
        label: "Your components exist",
        detail: "HotelCard, HotelGrid — your design system, your styles",
        activeNodes: ["designSystem"],
        flow: null,
      },
      {
        label: "Register renderers",
        detail: "Map A2UI component names to your React renderers with data binding resolvers",
        activeNodes: ["designSystem", "registry"],
        flow: { from: "designSystem", to: "registry" },
      },
      {
        label: "User asks a question",
        detail: '"Find me hotels in San Francisco for three nights"',
        activeNodes: ["user", "agent"],
        flow: { from: "user", to: "agent" },
      },
      {
        label: "Agent generates A2UI JSONL",
        detail: "surfaceUpdate (tree) + dataModelUpdate (state) + beginRendering (signal)",
        activeNodes: ["agent", "stream"],
        flow: { from: "agent", to: "stream" },
      },
      {
        label: "Renderer resolves bindings",
        detail: "JSON Pointer paths like /hotels/0/name are resolved against the data model",
        activeNodes: ["stream", "renderer", "registry"],
        flow: { from: "stream", to: "renderer" },
      },
      {
        label: "Your components render",
        detail: "Same HotelCard, same styles — A2UI just provided the props",
        activeNodes: ["renderer", "ui"],
        flow: { from: "renderer", to: "ui" },
      },
      {
        label: "User clicks Book Now",
        detail: "Action sent back to agent as structured JSON — no code execution",
        activeNodes: ["ui", "agent"],
        flow: { from: "ui", to: "agent" },
      },
    ],
  },
  openui: {
    name: "OpenUI Lang",
    by: "Thesys",
    tagline: "Token-efficient DSL for streaming generative UI",
    color: '#E86C3A',
    kind: "Custom DSL + React Runtime (+ C1 hosted API)",
    url: "https://openui.com",
    uiFormat: "OpenUI Lang — a line-oriented DSL streamed directly by the LLM",
    renderers: "React (@openuidev/react-lang)",
    llmGeneration: "Yes — custom DSL designed to minimize tokens",
    componentModel: "defineComponent + createLibrary with Zod schemas (@openuidev/react-lang)",
    stateBinding: "Props with Zod validation; key order determines positional args",
    streaming: "Native — line-oriented format designed for streaming parse",
    security: "Catalog-constrained, no arbitrary code execution",
    crossPlatform: "React (web)",
    hosting: "Self-hosted (open source) or Thesys C1 hosted API (OpenAI-compatible)",
    trustModel: "Component library defines the guardrails",
    summary: "OpenUI Lang is a custom DSL — not JSON, not JSX — designed for LLMs to generate UI descriptions in fewer tokens. The developer defines components with defineComponent and assembles them into a library with createLibrary (both from @openuidev/react-lang). The library auto-generates an LLM system prompt. The LLM responds in OpenUI Lang's compact assignment syntax, which a streaming parser converts to React components. Benchmarks show up to 67% fewer tokens than JSON alternatives. Thesys also offers C1, a hosted API (OpenAI-compatible) that can generate UI using these components.",
    dataFlow: [
      { label: "Developer defines components (defineComponent + Zod schemas)", from: "dev", to: "library" },
      { label: "createLibrary assembles components; library.prompt() generates system prompt", from: "library", to: "prompt" },
      { label: "User query + system prompt → LLM", from: "prompt", to: "llm" },
      { label: "LLM responds in OpenUI Lang (compact DSL tokens)", from: "llm", to: "stream" },
      { label: "Streaming parser validates against schemas line-by-line", from: "stream", to: "renderer" },
      { label: "Renderer maps parsed elements to React components", from: "renderer", to: "ui" },
    ],
    devWrites: `── What the developer writes ──
import { defineComponent, createLibrary } from "@openuidev/react-lang"

// 1. Define components with Zod schemas
const HotelCard = defineComponent({
  name: "HotelCard",
  description: "Displays a hotel with booking option",
  props: z.object({
    title: z.string(),
    description: z.string().optional(),
    imageUrl: z.string(),
    ctaLabel: z.string(),
  }),
  // Zod key order = positional arg order in the DSL
  component: ({ props }) => <HotelCardUI {...props} />,
})

// 2. Create library (auto-generates LLM system prompt)
const library = createLibrary({
  root: "Carousel",
  components: [Carousel, HotelCard],
})

// 3. Get the system prompt for the LLM
const systemPrompt = library.prompt()

── What the LLM responds with (OpenUI Lang) ──

// Compact, line-oriented DSL — NOT JSON:
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
        "Most token-efficient — up to 67% fewer tokens than JSON (benchmarked)",
        "Auto-generates LLM system prompts from your component library",
        "Zod schema validation with positional arg mapping",
        "Streaming-first — line-oriented parser renders progressively",
      ],
      considerations: [
        "React-only currently",
        "Custom DSL means smaller tooling ecosystem",
        "Thesys C1 hosted API is a separate product — open-source vs hosted lines can blur",
        "Newer project, smaller community (@openuidev packages)",
      ]
    },
    componentDefinition: `── Your design system components ──
// Same components — your code, your styles
function HotelCard({ name, neighborhood, imageUrl, price, rating, nights, onBook }) {
  return <Card>…your styled component…</Card>
}

── Registering with OpenUI Lang ──
import { defineComponent, createLibrary } from "@openuidev/react-lang"

const HotelCardDef = defineComponent({
  name: "HotelCard",
  description: "Displays a hotel with image, price, rating, and booking action",
  props: z.object({
    name: z.string(),
    neighborhood: z.string(),
    imageUrl: z.string(),
    price: z.number(),
    rating: z.number(),
    nights: z.number(),
    ctaLabel: z.string().default("Book Now"),
  }),
  component: ({ props }) => <YourHotelCard {...props} onBook={() => handleBook(props)} />,
})

const HotelGridDef = defineComponent({
  name: "HotelGrid",
  description: "Grid container for hotel cards",
  props: z.object({}),
  component: ({ children }) => <YourHotelGrid>{children}</YourHotelGrid>,
})

const library = createLibrary({
  root: "HotelGrid",
  components: [HotelGridDef, HotelCardDef],
})
// library.prompt() → auto-generated system prompt for the LLM`,
    wireFormat: `── OpenUI Lang Wire Format (DSL stream) ──

// Compact line-oriented syntax — NOT JSON
root = HotelGrid([c1, c2, c3])
c1 = HotelCard(
  "The Marker",
  "Union Square",
  "https://images.unsplash.com/...",
  289,
  4.6,
  3,
  "Book Now"
)
c2 = HotelCard(
  "Hotel Kabuki",
  "Japantown",
  "https://images.unsplash.com/...",
  215,
  4.4,
  3,
  "Book Now"
)
c3 = HotelCard(
  "The Battery",
  "Financial District",
  "https://images.unsplash.com/...",
  342,
  4.8,
  3,
  "Book Now"
)

// Zod key order = positional arg order
// ~67% fewer tokens than the equivalent JSON
// Actions handled via component event props`,
    pipelineSteps: [
      {
        label: "Your components exist",
        detail: "HotelCard, HotelGrid — your design system, your styles",
        activeNodes: ["designSystem"],
        flow: null,
      },
      {
        label: "Define + create library",
        detail: "defineComponent wraps each component with Zod schemas; createLibrary assembles them",
        activeNodes: ["designSystem", "registry"],
        flow: { from: "designSystem", to: "registry" },
      },
      {
        label: "Auto-generate system prompt",
        detail: "library.prompt() produces the LLM system prompt from your component definitions",
        activeNodes: ["registry", "llm"],
        flow: { from: "registry", to: "llm" },
      },
      {
        label: "User asks a question",
        detail: '"Find me hotels in San Francisco for three nights"',
        activeNodes: ["user", "llm"],
        flow: { from: "user", to: "llm" },
      },
      {
        label: "LLM responds in OpenUI Lang",
        detail: "Compact DSL: root = HotelGrid([c1, c2]) — ~67% fewer tokens than JSON",
        activeNodes: ["llm", "parser"],
        flow: { from: "llm", to: "parser" },
      },
      {
        label: "Streaming parser validates",
        detail: "Line-by-line parsing against Zod schemas, progressive rendering",
        activeNodes: ["parser", "renderer"],
        flow: { from: "parser", to: "renderer" },
      },
      {
        label: "Your components render",
        detail: "Same HotelCard, same styles — OpenUI Lang just described the structure",
        activeNodes: ["renderer", "ui"],
        flow: { from: "renderer", to: "ui" },
      },
    ],
  },
  jsonrender: {
    name: "json-render",
    by: "Vercel",
    tagline: "JSON-based generative UI with code export",
    color: '#000000',
    kind: "JSON Schema + React Runtime",
    url: "https://json-render.dev",
    uiFormat: "JSON (flat element tree with catalog constraints)",
    renderers: "React, React Native, Vue",
    llmGeneration: "Yes — constrained JSON output",
    componentModel: "defineCatalog with Zod schemas, named slots for children",
    stateBinding: "$state, $item, $index, $bindState, $bindItem, $template",
    streaming: "Yes — progressive JSON streaming",
    security: "Catalog-constrained, no arbitrary code execution",
    crossPlatform: "React, React Native, Vue",
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
      slots: ["default"],
      description: "Displays a hotel with image and price",
    },
  },
  actions: {
    bookHotel: {
      params: z.object({ hotelId: z.string() }),
      description: "Book a hotel room",
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
        "Rich built-in schema with many component types",
        "Code export — eject to standalone React via @json-render/codegen",
        "Mature data binding: $state, $bindState, $item, $bindItem, $template",
        "Multi-framework: React, React Native, and Vue renderers",
      ],
      considerations: [
        "JSON format is more verbose than compact alternatives",
        "Flat element tree can feel unfamiliar vs nested JSX",
        "Relatively new project, API still evolving",
        "Named slots model has a learning curve",
      ]
    },
    componentDefinition: `── Your design system components ──
// Same components — your code, your styles
function HotelCard({ name, neighborhood, imageUrl, price, rating, nights, children }) {
  return <Card>…your styled component…</Card>
}

── Registering with json-render ──
import { defineCatalog } from "@anthropic-ai/json-render"

const catalog = defineCatalog(schema, {
  components: {
    HotelCard: {
      description: "Displays a hotel with image, price, and rating",
      props: z.object({
        name: z.string(),
        neighborhood: z.string(),
        imageUrl: z.string(),
        price: z.number(),
        rating: z.number(),
        nights: z.number(),
      }),
      slots: ["default"],  // for nested children like buttons
      render: (props, children) => <YourHotelCard {...props}>{children}</YourHotelCard>,
    },
    HotelGrid: {
      description: "Grid of hotel cards",
      props: z.object({}),
      slots: ["default"],
      render: (_, children) => <YourHotelGrid>{children}</YourHotelGrid>,
    },
  },
  actions: {
    bookHotel: {
      params: z.object({ hotelId: z.string() }),
      description: "Book the selected hotel",
      handler: ({ hotelId }) => handleBooking(hotelId),
    },
  },
})`,
    wireFormat: `── json-render Wire Format (JSON stream) ──

{
  "root": "grid-1",
  "elements": {
    "grid-1": {
      "type": "HotelGrid",
      "children": ["card-1", "card-2", "card-3"]
    },
    "card-1": {
      "type": "HotelCard",
      "props": {
        "name": "The Marker",
        "neighborhood": "Union Square",
        "imageUrl": "https://images.unsplash.com/...",
        "price": 289,
        "rating": 4.6,
        "nights": 3
      },
      "children": ["book-1"]
    },
    "book-1": {
      "type": "Button",
      "props": { "label": "Book Now" },
      "on": { "press": {
        "action": "bookHotel",
        "params": { "hotelId": "hotel-1" }
      }}
    },
    "card-2": { "type": "HotelCard", "props": {...}, "children": ["book-2"] },
    "card-3": { "type": "HotelCard", "props": {...}, "children": ["book-3"] },
    "book-2": { "type": "Button", "props": {...}, "on": {...} },
    "book-3": { "type": "Button", "props": {...}, "on": {...} }
  }
}

// Flat element tree — no nesting
// Actions are declarative JSON, not callbacks
// Can be exported to standalone React via @json-render/codegen`,
    pipelineSteps: [
      {
        label: "Your components exist",
        detail: "HotelCard, HotelGrid — your design system, your styles",
        activeNodes: ["designSystem"],
        flow: null,
      },
      {
        label: "Define catalog + actions",
        detail: "defineCatalog registers components with Zod schemas and action handlers like bookHotel",
        activeNodes: ["designSystem", "registry"],
        flow: { from: "designSystem", to: "registry" },
      },
      {
        label: "Schema becomes system prompt",
        detail: "Catalog schema sent to the LLM as a system prompt constraining output",
        activeNodes: ["registry", "llm"],
        flow: { from: "registry", to: "llm" },
      },
      {
        label: "User asks a question",
        detail: '"Find me hotels in San Francisco for three nights"',
        activeNodes: ["user", "llm"],
        flow: { from: "user", to: "llm" },
      },
      {
        label: "LLM generates constrained JSON",
        detail: "Flat element tree with typed props, children refs, and declarative action bindings",
        activeNodes: ["llm", "stream"],
        flow: { from: "llm", to: "stream" },
      },
      {
        label: "Renderer maps elements",
        detail: "Each element type maps to your registered React component",
        activeNodes: ["stream", "renderer"],
        flow: { from: "stream", to: "renderer" },
      },
      {
        label: "Your components render",
        detail: "Same HotelCard, same styles — json-render just structured the data",
        activeNodes: ["renderer", "ui"],
        flow: { from: "renderer", to: "ui" },
      },
    ],
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
    stateBinding: "Built-in component state management + useTamboComponentState",
    streaming: "Yes — streaming component rendering",
    security: "Agent only renders registered components",
    crossPlatform: "React (web)",
    hosting: "Cloud hosted (free tier) or self-hosted open source",
    trustModel: "Agent inherits user's auth permissions",
    mcpSupport: "Built-in MCP support",
    summary: "Tambo wraps your React app in a TamboProvider and lets you register existing components with Zod schemas. It handles the agent runtime, streaming, state management (via useTamboComponentState), conversation storage, auth, and MCP integration. The React SDK is open source. It has a hosted cloud backend, though the degree to which the backend is self-hostable is unclear.",
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
    <TamboProvider components={components}>
      <YourApp />
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
        "Quick to get running — register components, wrap in provider, go",
        "Uses your existing React components as-is",
        "Built-in auth, conversation storage, MCP support",
        "Open source React SDK (@tambo-ai/react)",
      ],
      considerations: [
        "React-only (no cross-platform story)",
        "Cloud dependency for the agent backend",
        "Self-hosting the backend (not just the SDK) is unclear",
        "Less control over the agent layer vs building your own",
      ]
    },
    componentDefinition: `── Your design system components ──
// Same components — your code, your styles
function HotelCard({ name, neighborhood, imageUrl, price, rating, nights, onBook }) {
  return <Card>…your styled component…</Card>
}

── Registering with Tambo ──
const components = [
  {
    name: "HotelCard",
    description: "Displays a hotel with booking action",
    component: YourHotelCard,
    propsSchema: z.object({
      name: z.string(),
      neighborhood: z.string(),
      imageUrl: z.string(),
      price: z.number(),
      rating: z.number(),
      nights: z.number(),
    }),
    toolSchema: z.object({
      book: z.object({ hotelId: z.string() }),
    }),
  },
  {
    name: "HotelGrid",
    description: "Grid container for hotel cards",
    component: YourHotelGrid,
    propsSchema: z.object({}),
  },
]

function App() {
  return (
    <TamboProvider components={components}>
      <YourApp />
    </TamboProvider>
  )
}
// That's it — Tambo handles the rest`,
    wireFormat: `── Tambo Wire Format (streamed React props) ──

// Tambo streams component selection + props as JSON
// The agent runtime handles this — you don't see raw wire format

{
  "component": "HotelGrid",
  "children": [
    {
      "component": "HotelCard",
      "props": {
        "name": "The Marker",
        "neighborhood": "Union Square",
        "imageUrl": "https://images.unsplash.com/...",
        "price": 289,
        "rating": 4.6,
        "nights": 3
      }
    },
    {
      "component": "HotelCard",
      "props": {
        "name": "Hotel Kabuki",
        "neighborhood": "Japantown",
        "imageUrl": "https://images.unsplash.com/...",
        "price": 215,
        "rating": 4.4,
        "nights": 3
      }
    },
    {
      "component": "HotelCard",
      "props": {
        "name": "The Battery",
        "neighborhood": "Financial District",
        "imageUrl": "https://images.unsplash.com/...",
        "price": 342,
        "rating": 4.8,
        "nights": 3
      }
    }
  ]
}

// Props stream directly into your registered components
// Actions flow through useTamboComponentState
// Agent handles tool calls for bookHotel via toolSchema`,
    pipelineSteps: [
      {
        label: "Your components exist",
        detail: "HotelCard, HotelGrid — your design system, your styles",
        activeNodes: ["designSystem"],
        flow: null,
      },
      {
        label: "Register + wrap in provider",
        detail: "List components with propsSchema, wrap app in TamboProvider — that's the setup",
        activeNodes: ["designSystem", "registry"],
        flow: { from: "designSystem", to: "registry" },
      },
      {
        label: "User asks a question",
        detail: '"Find me hotels in San Francisco for three nights"',
        activeNodes: ["user", "cloud"],
        flow: { from: "user", to: "cloud" },
      },
      {
        label: "Tambo cloud agent responds",
        detail: "Agent selects HotelGrid + HotelCard, generates props matching your Zod schemas",
        activeNodes: ["cloud", "stream"],
        flow: { from: "cloud", to: "stream" },
      },
      {
        label: "Props stream into components",
        detail: "Tambo streams component selection and props directly to your registered components",
        activeNodes: ["stream", "renderer"],
        flow: { from: "stream", to: "renderer" },
      },
      {
        label: "Your components render",
        detail: "Same HotelCard, same styles — Tambo just matched and populated them",
        activeNodes: ["renderer", "ui"],
        flow: { from: "renderer", to: "ui" },
      },
      {
        label: "User clicks Book Now",
        detail: "Action flows through useTamboComponentState back to the cloud agent",
        activeNodes: ["ui", "cloud"],
        flow: { from: "ui", to: "cloud" },
      },
    ],
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

function AnimatedFlowDiagram({ framework }) {
  const fw = FRAMEWORKS[framework];
  const steps = fw.pipelineSteps;
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stepEls = container.querySelectorAll('[data-step]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveStep(Number(entry.target.dataset.step));
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    stepEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [framework]);

  const allNodes = [...new Set(steps.flatMap(s => s.activeNodes))];

  return (
    <div ref={containerRef}>
      {/* Sticky diagram area */}
      <div style={{
        position: 'sticky',
        top: 80,
        zIndex: 10,
        background: COLORS.cream,
        padding: '1rem 0',
        borderBottom: `1px solid ${COLORS.fog}`,
        marginBottom: '1rem',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}>
          {allNodes.map(nodeId => {
            const node = FLOW_NODES[nodeId];
            const isActive = steps[activeStep]?.activeNodes.includes(nodeId);
            const flow = steps[activeStep]?.flow;
            const isSource = flow?.from === nodeId;
            const isTarget = flow?.to === nodeId;

            return (
              <div key={nodeId} style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 8,
                border: `2px solid ${isActive ? fw.color : COLORS.fog}`,
                background: isActive ? `${fw.color}12` : '#fff',
                opacity: isActive ? 1 : 0.35,
                transition: 'all 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                position: 'relative',
              }}>
                {(isSource || isTarget) && (
                  <div style={{
                    position: 'absolute',
                    top: -2, left: -2, right: -2, bottom: -2,
                    borderRadius: 10,
                    border: `2px solid ${fw.color}`,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                )}
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: isActive ? fw.color : COLORS.dusk,
                }}>
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>

        {steps[activeStep]?.flow && (
          <div style={{
            textAlign: 'center',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.7rem',
            color: fw.color,
            marginTop: '0.5rem',
            fontWeight: 600,
          }}>
            {FLOW_NODES[steps[activeStep].flow.from]?.label} → {FLOW_NODES[steps[activeStep].flow.to]?.label}
          </div>
        )}
      </div>

      {/* Scrollable step descriptions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {steps.map((step, i) => (
          <div
            key={i}
            data-step={i}
            style={{
              padding: '1.25rem',
              borderRadius: 10,
              border: `1px solid ${i === activeStep ? fw.color : COLORS.fog}`,
              background: i === activeStep ? `${fw.color}08` : '#fff',
              transition: 'all 0.3s ease',
              minHeight: 80,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i === activeStep ? fw.color : COLORS.fog,
                color: i === activeStep ? '#fff' : COLORS.dusk,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.75rem', fontWeight: 600,
                flexShrink: 0,
                transition: 'all 0.3s ease',
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontWeight: 600, fontSize: '0.95rem',
                  color: COLORS.warmBlack,
                  letterSpacing: '-0.02em',
                }}>
                  {step.label}
                </div>
                <div style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '0.85rem',
                  color: COLORS.dusk,
                  lineHeight: 1.5,
                  marginTop: '0.2rem',
                }}>
                  {step.detail}
                </div>
              </div>
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
    { id: 'pipeline', label: 'Pipeline' },
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

        {/* ---- PIPELINE VIEW ---- */}
        {view === 'pipeline' && (
          <div>
            <SectionHeader sub={`"Find me hotels in San Francisco for three nights" — one prompt, traced through ${fw.name}'s pipeline from component registration to rendered UI.`}>
              Anatomy of a Response
            </SectionHeader>

            {/* Framework tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {fwKeys.map(k => (
                <FrameworkTab
                  key={k} id={k}
                  active={activeFramework === k}
                  onClick={() => setActiveFramework(k)}
                />
              ))}
            </div>

            {/* Stage 1: Component Definition */}
            <SectionHeader sub="You already have these components. Here's how you register them.">
              1. Define Your Components
            </SectionHeader>
            <CodeBlock code={fw.componentDefinition} framework={activeFramework} />

            {/* Stage 2: Data Flow */}
            <SectionHeader sub="What happens when the user asks their question? Scroll to follow the data.">
              2. The Pipeline
            </SectionHeader>
            <AnimatedFlowDiagram framework={activeFramework} />

            {/* Stage 3: Wire Format */}
            <SectionHeader sub="This is what the LLM actually outputs — the raw response before your renderer touches it.">
              3. What the LLM Outputs
            </SectionHeader>
            <CodeBlock code={fw.wireFormat} framework={activeFramework} />

            {/* Stage 4: Rendered Result */}
            <SectionHeader sub="Same components, same data, same result — regardless of which framework got you here.">
              4. What the User Sees
            </SectionHeader>
            <div style={{
              padding: '1.5rem',
              border: `1px solid ${COLORS.fog}`,
              borderRadius: 10,
              background: '#fff',
            }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.7rem',
                color: COLORS.dusk,
                marginBottom: '1rem',
                padding: '0.4rem 0.75rem',
                background: `${fw.color}0D`,
                borderRadius: 6,
                display: 'inline-block',
              }}>
                Rendered via {fw.name}
              </div>
              <HotelGrid hotels={SAMPLE_HOTELS} />
            </div>
          </div>
        )}

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

            <SectionHeader sub="The same question — 'Find me hotels in San Francisco for three nights' — handled by each framework. See the Pipeline view for the full walkthrough.">
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
                <AnimatedFlowDiagram framework={activeFramework} />
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
              <AnimatedFlowDiagram framework={activeFramework} />
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
                      {k === 'openui' && "Token efficiency matters (high-volume, cost-sensitive), you want automatic system prompt generation from your component library, and you're building in React with a streaming-first architecture. C1 hosted API available if you want managed infrastructure."}
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
