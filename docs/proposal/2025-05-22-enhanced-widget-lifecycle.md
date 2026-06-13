# Proposal: Enhanced Widget Lifecycle & Hooks

## Problem Statement
The current `loadWidgets` implementation is a "fire and forget" system. Developers have no way to know when a specific widget has finished loading, if it failed, or to perform cleanup when a widget is removed from the DOM.

## Proposed Solution
Introduce a lifecycle hook system for widgets.

### New Features
1. **Events**: Publish events like `widget.loading`, `widget.loaded`, and `widget.error` with the element and URL as payload.
2. **Promises**: Change `loadWidgets()` to return a Promise that resolves when all widgets on the page have finished loading.
3. **Data Attributes**: Add `data-widget-on-load` attribute to execute a callback function once the widget is ready.
4. **Cleanup Hook**: Provide a way for widgets to register cleanup functions (e.g., removing event listeners) when they are replaced.

### Example
```javascript
$$.loadWidgets().then(() => {
  console.log('All widgets ready!');
});

$$.subscribe('widget.loaded', (data) => {
  initThirdPartyTool(data.element);
});
```

## Impact
This will allow for much more complex and interactive widget-based architectures without resorting to global polling or fragile timing logic.
