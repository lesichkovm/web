# WebJS vs. Mithril.js

## High-level Snapshot

- **WebJS**: Utility-centered toolkit that exposes navigation, registry-backed state, and DOM helpers through the global `$$`, enabling progressive enhancement of multipage applications (MPAs) without adopting a component runtime.@README.md#5-19 @src/web.js#32-200 @src/core/navigation.js#1-75
- **Mithril.js**: Client-side SPA microframework (~8kb gzipped) built around components, a virtual DOM, and routing/XHR helpers—positioned here as a legacy option focused on single-page interfaces.

## Core Differences

| Aspect | WebJS | Mithril.js |
| --- | --- | --- |
| Primary Use Case | Augment server-rendered or legacy pages with shared utilities and lightweight widgets.@README.md#48-120 @src/loadWidgets.js#1-45 | Build full SPA experiences with client-side routing and component trees (treated as legacy in this stack). |
| Application Paradigm | Multi-Page Application (MPA) enhancement model that keeps traditional navigation patterns.@src/core/navigation.js#1-75 | Single-Page Application (SPA) paradigm with client-side view orchestration and limited direct MPA affordances. |
| Rendering Model | Relies on existing DOM; enhances via helpers like widget/background loaders rather than diffing a virtual tree.@src/loadWidgets.js#1-45 @src/loadBackgroundImages.js#1-69 | Virtual DOM diffing updates component views efficiently without full reloads. |
| State Management | Central RegistryJS store accessed through `$$.get` / `$$.set`, scoped per application instance.@src/web.js#41-123 | Component-local state and optional global stores; redraw cycle managed by Mithril. |
| Routing | `navigation.to()` performs standard navigations (with `_blank` handling and query composition).@src/core/navigation.js#1-75 | `m.route` offers client-side routing with nested layouts and lifecycle hooks. |
| Size & Dependencies | Pure utilities plus `@lesichkovm/registryjs`, bundled as an IIFE for CDN consumption (minified bundle `dist/web.min.js` ≈7.5 KB).@package.json#24-26 @src/esbuild.config.js#17-44 @dist/web.min.js#1-1 | ~8kb core including router/XHR helpers, no external deps. |
| Learning Curve | Familiar imperative API through `$$`; minimal abstractions to learn.@README.md#46-191 | Requires adopting component lifecycle concepts and hyperscript (`m()`)/JSX. |
| Testing Strategy | Ships with Jest + JSDOM configuration for DOM-focused utilities.@package.json#7-23 @jest.config.js#1-8 | Integrates with standard JS test runners; components often tested via DOM shims or integration harnesses. |

## Strengths & Trade-offs

### Where WebJS Excels

1. **Incremental Enhancement**: Drop-in utilities simplify URL parsing, auth persistence, and navigation without restructuring templates.@src/web.js#74-200 @src/core/url.js#1-94 @src/core/auth.js#1-60
2. **Widget Bootstrapping**: `loadWidgets` fetches remote fragments, injects them, and executes embedded scripts—ideal for CMS-driven sections or dashboard tiles.@src/loadWidgets.js#1-45
3. **Lightweight Eventing**: Built-in pub/sub enables decoupled widget communication with minimal ceremony.@src/core/pubsub.js#1-68

### Where Mithril.js Leads (Legacy SPA Option)

1. **Single-page Navigation**: Built-in router delivers smooth in-app transitions without full page reloads when an SPA is required.
2. **Component Reuse**: Declarative components encapsulate state and lifecycle, supporting nested UI composition.
3. **Granular UI Updates**: Virtual DOM diffing and redraw system keep rendering efficient for dynamic interfaces.

## Decision Guidelines

- Choose **WebJS** when enhancing existing multipage applications, sharing state via the registry, or progressively loading widgets without committing to a component framework—its helpers assume and reinforce MPA workflows.
- Opt for **Mithril.js** when you must maintain or interoperate with existing SPA surfaces, accepting that this approach is considered legacy for new work.
- Consider a hybrid approach that leverages WebJS utilities for cross-page concerns while mounting Mithril components inside specific widgets loaded via `loadWidgets` for richer islands of interactivity.@src/loadWidgets.js#1-45
