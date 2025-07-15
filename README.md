# WebJS

![tests](https://github.com/lesichkovm/web/workflows/tests/badge.svg)

WebJS is a lightweight framework for building standard multipage web applications.
All utilities are accessible through a simple `$$` global object.
It brings back the joy of web development.

## Features

WebJS provides a set of utility functions for common web development tasks:

- **URL Utilities**: Parse and manipulate URLs and query parameters
- **Auth Helpers**: Simple functions for managing authentication state
- **Event System**: Lightweight pub/sub for component communication
- **Widget Loading**: Dynamically load and execute widget content
- **Persistent Key-Value Store**: Simple storage that persists across page reloads
- **Tiny Footprint**: No external dependencies, just pure JavaScript

## Installation

### Using CDN (Recommended)

```html
<!-- Load latest WebJS from CDN -->
<script src="https://cdn.jsdelivr.net/gh/lesichkovm/web@latest/dist/web.min.js"></script>

<!-- Load specific version of WebJS from CDN -->
<script src="https://cdn.jsdelivr.net/gh/lesichkovm/web@v2.9.0/dist/web.min.js"></script>
```

### npm Package

```bash
npm install @lesichkovm/web
```

Then in your application:

```javascript
import '@lesichkovm/web';
// Access WebJS via window.$$ or window.WebJS
```


## Basic Usage

### Loading Widgets

WebJS makes it easy to dynamically load and execute widget content from external URLs:

```html
<!-- Add widgets to your HTML -->
<div data-widget-url="/widgets/user-profile">Loading user profile...</div>
<div data-widget-url="/widgets/recent-activity">Loading recent activity...</div>

<!-- Initialize widgets when the DOM is ready -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Load all widgets on the page
    $$.loadWidgets();
  });
</script>
```

#### How It Works

1. Finds all elements with `data-widget-url` attribute
2. Fetches the content from the specified URL
3. Injects the HTML content into the element
4. Executes any scripts included in the widget content

#### Error Handling

If a widget fails to load, an error will be logged to the console:

```
Error loading widget: /widgets/user-profile Error: Network Error
```

### Accessing WebJS

WebJS is available globally as `$$` or `window.WebJS`:

```javascript
// Using the global $$
const name = $$.getUrlParam('name');

// Or using window.WebJS
const token = window.WebJS.getAuthToken();
```

## Core Methods

### Registry (Key-Value Storage)

```javascript
// Set a value
$$.set('user.preferences.theme', 'dark');

// Get a value
const theme = $$.get('user.preferences.theme'); // Returns 'dark'
```

### URL Handling

```javascript
// Get current URL
const currentUrl = $$.getUrl();

// Get URL parameter
const id = $$.getUrlParam('id');

// Get all URL parameters
const params = $$.getUrlParams();

// Navigate to a new URL
$$.to('/dashboard');
```

### Authentication Helpers

WebJS provides a set of authentication helpers to manage user authentication state.

```javascript
// Set authentication token (e.g., JWT)
$$.setAuthToken('your-auth-token');

// Get current token
const token = $$.getAuthToken();

// Set authenticated user
$$.setAuthUser({ id: 1, name: 'John Doe' });

// Get current user
const user = $$.getAuthUser();
```

### Event System (Pub/Sub)

WebJS includes a powerful event system that follows the publish/subscribe pattern,
allowing different parts of your application to communicate without direct dependencies.

#### Basic Usage

```javascript
// Subscribe to an event
const subscription = $$.subscribe('user.updated', (data) => {
  console.log('User updated:', data);
});

// Publish an event
$$.publish('user.updated', { id: 1, name: 'Jane Doe' });

// Unsubscribe when done
subscription.unsubscribe();
```

#### Common Patterns

```javascript
// System events
$$.subscribe('app.initialized', (config) => {
  console.log('App initialized with config:', config);
});

// User interaction events
$$.subscribe('cart.updated', (cart) => {
  updateCartUI(cart);
  $$.publish('analytics.track', { event: 'cart_updated', items: cart.items });
});

// Clean up all subscriptions when component unmounts
const subscriptions = [
  $$.subscribe('event1', handler1),
  $$.subscribe('event2', handler2)
];

// Later...
subscriptions.forEach(sub => sub.unsubscribe());
```

### Language

```javascript
// Set language
$$.setLanguage('en');

// Get current language
const lang = $$.getLanguage();
```

## API Reference

### Registry Methods

#### `$$.get(key)`
Returns a value from the registry by key. Returns `null` if the key is not set.

```javascript
const theme = $$.get('user.preferences.theme');
```

#### `$$.set(key, value)`
Stores a value in the registry. Returns the set value.

```javascript
$$.set('user.preferences.theme', 'dark');
```

### URL Methods

#### `$$.getUrl()`
Returns the current URL as a string.

#### `$$.getUrlParam(param)`
Returns the value of a URL query parameter. Returns `null` if the parameter is not present.

```javascript
const id = $$.getUrlParam('id');
```

#### `$$.getUrlParams()`
Returns an object containing all URL query parameters.

```javascript
const params = $$.getUrlParams();
// Example: for URL ?id=123&filter=active
// Returns: { id: '123', filter: 'active' }
```

#### `$$.getHashParameter()`
Returns the current URL hash (without the # symbol) or `null` if no hash is present.

#### `$$.to(url)`
Navigates to the specified URL. Can be relative or absolute.

```javascript
// Relative URL
$$.to('/dashboard');

// Absolute URL
$$.to('https://example.com');
```

### Authentication Methods

#### `$$.getAuthToken()`
Returns the current authentication token or `null` if not set.

#### `$$.setAuthToken(token)`
Sets the authentication token. Pass `null` to clear the token.

```javascript
// Set token
$$.setAuthToken('your-jwt-token');

// Clear token
$$.setAuthToken(null);
```

#### `$$.getAuthUser()`
Returns the currently authenticated user object or `null` if not authenticated.

#### `$$.setAuthUser(user)`
Sets the authenticated user. Pass `null` to clear the user.

```javascript
// Set user
$$.setAuthUser({ id: 1, name: 'John Doe' });

// Clear user
$$.setAuthUser(null);
```

### Language Methods

#### `$$.getLanguage()`
Returns the current language code (defaults to 'en' if not set).

#### `$$.setLanguage(language)`
Sets the current language.

```javascript
$$.setLanguage('es');
```

## Advanced Configuration

WebJS is designed to work out of the box with zero configuration. The following section is only needed for advanced use cases.

### Loading Configuration

If you need to customize WebJS behavior, create a `config.js` file and load it **before** WebJS:

```html
<!-- Load configuration first (optional) -->
<script src="config.js"></script>
<!-- Then load WebJS -->
<script src="https://cdn.jsdelivr.net/gh/lesichkovm/web@latest/dist/web.min.js"></script>
```

### When to Use Configuration

You might want to create a `config.js` file if you need to:
- Set a custom API URL (different from `/api` on the current host)
- Override the default host detection
- Set an application ID for tracking or analytics

### Example Configuration

Create a `config.js` file in your project root if you need to customize the behavior:

```js
// config.js
var APP_ID = "my-app";          // Optional: Your application ID
var WEBSITE_URL = "https://example.com";  // Optional: Override default host
var API_URL = "https://api.example.com";  // Optional: Set custom API endpoint
```

### Development Auto-Configuration

During development (when running on localhost), WebJS will automatically detect and configure itself:

```js
// This is handled automatically - no need to include this in your config
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    // Auto-detect local development server
    WEBSITE_URL = window.location.protocol + '//' + window.location.hostname + 
                 (window.location.port ? ':' + window.location.port : '');
    API_URL = WEBSITE_URL + '/api';
}
```

## License

MIT