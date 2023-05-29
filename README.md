# WebJS #

![tests](https://github.com/lesichkovm/web/workflows/tests/badge.svg)

WebJS is a framework for buiding standard multipage web applications.

## Installation Using CDN ##

Step 1) Create a file **config.js**

```js
var APP_ID = "";      // Your APP unique ID (optional)
var WEBSITE_URL = ""; // Your website root URL
var API_URL = "";     // Your website API URL (optional)
if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
    WEBSITE_URL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
}
```

Step 2) Add to your webpage

```html
<script src="config.js"></script>
<script src="https://cdn.jsdelivr.net/gh/lesichkovm/web@2.6.6/bin/web.js"></script>
```

## Manual Installation ##

Step 1) Create a file **config.js**

```js
var APP_ID = "";      // Your APP unique ID
var WEBSITE_URL = ""; // Your website root URL
var API_URL = "";     // Your website API URL
if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "") {
    WEBSITE_URL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
}
```

Step 2) Download the **web.js** library locally and add to your webpage

```html
<script src="config.js"></script>
<script src="web.js"></script>
```

Alternatively you may want to download automatically using Gulp

```javascript
gulp.task('web', function (done) {
    var url = "https://cdn.jsdelivr.net/gh/lesichkovm/web@latest/bin/web.js";

    download(url)
        .pipe(gulp.dest("js/"));

    done();
});
```


# Usage #

WebJS registers itself under the $$ namespace.

```js
$(function(){
  var name = $$.getUrlParam('name');
  alert('Your name is ' + name);
});
```

## Methods ##

### $$.get(key) ###

Returns a key from registry or NULL if not set

### $$.set(key, value) ###

Sets a key-value pair to registry or NULL if not set

### $$.getHashParameter() ###
Returns a hash parameter or NULL if not set

### $$.getUrl() ###
Returns the current URL

### $$.getUrlParam() ###
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

### $$.getAuthToken() ###
Returns the authentication token or NULL

### $$.setAuthToken(token) ###
Sets the authentication token. To remove set it to NULL

### $$.getAuthUser() ###
Returns the authenticated user or NULL

### $$.setAuthUser(user) ###
Sets the authenticated user. To remove set it to NULL

### $$.to(url) ###
Redirects to current webpage to the specified URL (relative or absolute)

### (DEPRECATED) $$.ws(action, data) ###
Calls the API with the specified action and data. Returns a promise

```javscript
var p = $$.ws('login',{username:"",password:""});

p.done(function(response){ }); // Call successful

p.fail(function(error){ console.log(error) }); // Call failed

p.always(function(){ }); // After call is completed
```

If the API_URL ends with / or .json . The actions will be send like this:

api.url.com/?command=action

Otherwise they will be send using nice URLs

api.url.com/action


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
