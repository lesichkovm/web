# WebJS vs. React

## High-level Snapshot

- **WebJS**: Utility-centered toolkit that exposes navigation, registry-backed state, and DOM helpers through the global `$$`, enabling progressive enhancement of multipage applications (MPAs) without adopting a component runtime.@README.md#5-19 @src/web.js#32-200 @src/core/navigation.js#1-75
- **React**: Component library for building declarative UIs that leans on a virtual DOM, hooks-based composition, and a vast ecosystem—optimized for SPAs and islands of interactivity.

## Core Differences

| Aspect | WebJS | React |
| --- | --- | --- |
| Primary Use Case | Augment server-rendered or legacy pages with shared utilities and lightweight widgets.@README.md#48-120 @src/loadWidgets.js#1-45 | Build component-driven interfaces that lean on client-side rendering or hydration.
| Application Paradigm | Multi-Page Application (MPA) enhancement model that keeps traditional navigation patterns.@src/core/navigation.js#1-75 | SPA/ISR/SSR frameworks compose React components for routed experiences; islands embed components into MPAs.
| Rendering Model | Relies on existing DOM; enhances via helpers like widget/background loaders rather than diffing a virtual tree.@src/loadWidgets.js#1-45 @src/loadBackgroundImages.js#1-69 | Virtual DOM diffing reconciles component trees and hydrates server-rendered markup.
| State Management | Central RegistryJS store accessed through `$$.get` / `$$.set`, scoped per application instance.@src/web.js#41-123 | Hook-based local state, context for shared data, and broad ecosystem of global state libraries (Redux, Zustand, etc.).
| Routing | `navigation.to()` performs standard navigations (with `_blank` handling and query composition).@src/core/navigation.js#1-75 | Routing delivered by companion libraries (React Router, Next.js) with client-side transitions and nested layouts.
| Size & Dependencies | Pure utilities plus `@lesichkovm/registryjs`, bundled as an IIFE for CDN consumption (minified bundle `dist/web.min.js` ≈7.5 KB).@package.json#24-26 @src/esbuild.config.js#17-44 @dist/web.min.js#1-1 | Core `react` + `react-dom` packages (~40–45 KB gzipped combined) typically bundled with build tooling.
| Learning Curve | Familiar imperative API through `$$`; minimal abstractions to learn.@README.md#46-191 | Requires understanding component composition, JSX or `createElement`, hooks, and rendering constraints.
| Testing Strategy | Ships with Jest + JSDOM configuration for DOM-focused utilities.@package.json#7-23 @jest.config.js#1-8 | Component testing commonly uses React Testing Library, Cypress, or Playwright with a rich ecosystem of helpers.

## Strengths & Trade-offs

### Where WebJS Excels

1. **Incremental Enhancement**: Drop-in utilities simplify URL parsing, auth persistence, and navigation without restructuring templates.@src/web.js#74-200 @src/core/url.js#1-94 @src/core/auth.js#1-60
2. **Widget Bootstrapping**: `loadWidgets` fetches remote fragments, injects them, and executes embedded scripts—ideal for CMS-driven sections or dashboard tiles.@src/loadWidgets.js#1-45
3. **Lightweight Eventing**: Built-in pub/sub enables decoupled widget communication with minimal ceremony.@src/core/pubsub.js#1-68

### Where React Leads

1. **Component Ecosystem**: A mature library of UI components, design systems, and patterns accelerates feature delivery across complex products.
2. **Fine-Grained UI Composition**: Hooks and context enable encapsulated stateful logic that can be shared across component trees.
3. **Platform Integrations**: Rich tooling for SSR/ISR (Next.js), mobile (React Native), and desktop (Electron) broadens deployment options.

## Decision Guidelines

- Choose **WebJS** when enhancing existing multipage applications, sharing state via the registry, or progressively loading widgets without committing to a component framework—its helpers assume and reinforce MPA workflows.
- Opt for **React** when teams need reusable component abstractions, ecosystem breadth, or client-side routing sophistication to support dynamic views.
- Consider a hybrid approach that leverages WebJS utilities for cross-page concerns while mounting React islands via `loadWidgets` for interactive sections, letting React manage complex UI while WebJS retains control over navigation and shared state.@src/loadWidgets.js#1-45
