# Comparison Table Rethink — Design

Covers MZR-141.

## Problem

Current 8 dimensions don't differentiate. "Streaming: Yes" and "Security: catalog-constrained" are the same for all four frameworks. The table tells you nothing you couldn't guess.

## New Dimensions (7)

Replace all 8 current dimensions with 7 that produce meaningfully different answers across frameworks.

### 1. LLM Output Format
- A2UI: JSONL — streaming adjacency list. Three message types: component tree, data model, render signal. Each line is independently parseable.
- OpenUI: Custom DSL — line-oriented assignment syntax, not JSON. Positional args mapped from Zod key order. ~67% fewer tokens than JSON equivalents.
- json-render: JSON — flat element tree with typed props and declarative action bindings. Elements reference children by ID, not nesting.
- Tambo: JSON — component name + props object. The cloud agent selects components and generates props matching your Zod schemas.

### 2. Platform Reach
- A2UI: Angular, Flutter, Lit/Web Components stable. React, SwiftUI, Vue planned. The spec is renderer-agnostic by design.
- OpenUI: React only (@openuidev/react-lang). C1 hosted API is framework-agnostic on the wire, but the renderer is React.
- json-render: React, React Native, and Vue renderers available. Broadest multi-framework support of the SDK-based options.
- Tambo: React only (@tambo-ai/react). No cross-platform story currently.

### 3. Agent Runtime
- A2UI: You run everything. A2UI is a protocol — bring your own agent, LLM, and infrastructure.
- OpenUI: You run the LLM calls. The framework handles parsing. Self-hosted, or use Thesys C1 hosted API.
- json-render: You run the LLM calls and rendering. Fully self-hosted, no cloud dependency.
- Tambo: Tambo cloud runs the agent by default. You send messages, their backend selects components and generates props. Self-host escape hatch unclear.

### 4. Component Awareness
- A2UI: The LLM generates against a catalog of component names. It knows the component tree structure but data binding is abstracted via JSON Pointer paths.
- OpenUI: The LLM gets an auto-generated system prompt from your component library. It learns your API through library.prompt() — fully automated.
- json-render: The LLM gets your catalog schema as a system prompt. It knows component names, prop types, and available actions.
- Tambo: The agent knows your component names and Zod schemas. Component selection and prop generation happen in Tambo's cloud runtime.

### 5. Action Model
- A2UI: Declarative. Actions are JSON messages sent back to the agent — no code execution on the client. Designed for untrusted agents.
- OpenUI: Component event props. Actions flow through your React component callbacks, same as any React app.
- json-render: Declarative JSON. Actions defined in the catalog with typed params. Handler functions run client-side.
- Tambo: Agent round-trip. Actions flow through useTamboComponentState back to the cloud agent, which can respond with new UI.

### 6. Ejection Story
- A2UI: Strong. Open spec (Apache 2.0). Your components are standard code. Switch renderers or protocols without rewriting UI.
- OpenUI: Good. Open source SDK. Components are standard React. The DSL layer is the coupling point — you'd need to swap the parser.
- json-render: Strong. Code export via @json-render/codegen — eject any generated UI to standalone React with zero runtime dependency.
- Tambo: Moderate. React SDK is open source. Components are standard React. But the cloud agent runtime is the coupling — unclear self-host path.

### 7. Data Binding
- A2UI: JSON Pointer paths into a shared data model. Components reference data by path (e.g. /hotels/0/name), resolved at render time.
- OpenUI: Direct props. Zod-validated values passed as positional args in the DSL, mapped to React props.
- json-render: Rich binding system. $state, $bindState, $item, $bindItem, $template for lists, conditional rendering, two-way binding.
- Tambo: Direct props + built-in state. Props from agent, plus useTamboComponentState for component-local state that syncs back to agent.

## Implementation

- Replace the DIMENSIONS array and corresponding framework fields
- Remove old dimension fields (streaming, security, etc.) from each framework
- Add new dimension fields with the content above
- Cell style stays the same (descriptive prose)
