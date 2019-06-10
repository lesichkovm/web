# Initialize #

Initialize is a framework for buiding web applications.

## Installation ##

1. Using CDN
Add the following after JQuery

```html
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

### $.to(url) ###
Redirects to current webpage to the specified URL (relative or absolute)

### $.ws(action, data) ###
Calls the API with the specified action and data. Returns a promise

```javscript
var p = $$.ws('login',{username:"",password:""});

p.done(function(response){ }); // Call successful

p.fail(function(error){ console.log(error) }); // Call failed

p.always(function(){ }); // After call is completed
```
