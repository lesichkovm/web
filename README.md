# Initialize #

Initialize is a framework for buiding web applications.

## Installation ##

1. Using CDN

Add the following after JQuery

```html
<script>
  var APP_ID = "";      // Your APP unique ID
  var WEBSITE_URL = ""; // Your website root URL
  var API_URL = "";     // Your website API URL
</script>
<script src="https://cdn.jsdelivr.net/gh/lesichkovm/web@1.0.0/initialize.js"></script>
```

2. Manual

Download the initialize.js library and add to your webpage after JQuery

```html
<script>
  var APP_ID = "";      // Your APP unique ID
  var WEBSITE_URL = ""; // Your website root URL
  var API_URL = "";     // Your website API URL
</script>
<script src="initialize.js"></script>
```

# Usage #

Initialize registers itself under the $$ name.

## Methods ##

### $$.getHashParameter() ###
Returns a hash parameter or NULL if not set

### $$.getUrl() ###
Returns the current URL

### $$.getUrlParams() ###
Returns a single query parameter or NULL if not set

```javscript
var name = $$.getUrlParam("name");
alert("Hi" + (name==null ? "Stranger" : name));
```

### $$.getUrlParams() ###
Returns the query parameters from the current URL

### $$.getLanguage() ###
Returns the language or 'en' if not set

### $$.setLanguage(language) ###
Sets the language

### $$.getToken() ###
Returns the authentication token or NULL

### $$.setToken(token) ###
Sets the authentication token. To remove set it to NULL

### $$.getUser() ###
Returns the authenticated user or NULL

### $$.setUser(user) ###
Sets the authenticated user. To remove set it to NULL

### $$.to(url) ###
Redirects to current webpage to the specified URL (relative or absolute)

### $$.ws(action, data) ###
Calls the API with the specified action and data. Returns a promise

```javscript
var p = $$.ws('login',{username:"",password:""});

p.done(function(response){ }); // Call successful

p.fail(function(error){ console.log(error) }); // Call failed

p.always(function(){ }); // After call is completed
```
### $$.log(message) ###
Logs message to console, if debug is enabled

## Publish Subscibe Methods ##

### $.publish("event-name", data) ###

### $.subscribe("event-name") ###

### $.unsubscribe("event-name") ###

# Registry #

The registry provides persistence across requests using Local Storage.

## Methods ##

### Registry.get(key) ###
Gets a key from the registry

### Registry.set(key, value, expires) ###
Sets a key in the registry. Optional expiration time in seconds

### Registry.remove(key) ###
Removes a key from the registry

### Registry.empty() ###
Empties the registry
