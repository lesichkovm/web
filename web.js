function Config() {
  this.getUniqueId = function () {
    return typeof APP_ID == "undefined"
      ? JSON.stringify(window.location.hostname)
      : APP_ID;
  };
  this.getRootUrl = function () {
    return typeof WEBSITE_URL == "undefined"
      ? window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port ? ":" + location.port : "")
      : WEBSITE_URL;
  };
  this.getApiUrl = function () {
    return typeof API_URL == "undefined"
      ? window.location.protocol +
          "//" +
          window.location.hostname +
          (location.port ? ":" + window.location.port : "") +
          "/api"
      : API_URL;
  };
}

// Import the Registry from external package
// https://github.com/lesichkovm/registryjs
// https://www.npmjs.com/package/@lesichkovm/registryjs


/**
 * Initialize
 * @type $$
 */
function Initialize() {
  /* START: Public Scope */
  this.debug = true;

  /**
   * Stores a key-value pair to the registry
   *
   * @param {String} key
   * @param {Object} value
   * @returns {Object}
   */
  this.get = function (key) {
    return Registry.get(key);
  };

  /**
   * Retrieves a key value from the registry
   *
   * @param {String} key
   * @returns {Object}
   */
  this.set = function (key, value) {
    return Registry.set(key, value);
  };
  
  /**
   * Returns the API URL
   * If an API_URL variable is set, will return as it is. Otherwise will
   * generate one, assuming the API is hosted on the same domain {domain}/api
   * @returns {String}
   */
  this.getApiUrl = function () {
    return Config.getApiUrl();
  };

  /**
   * Returns the current page URL
   *
   * @returns {String}
   */
  this.getUrl = function () {
    return window.location.href;
  };

  /**
   * Returns the URL parameters
   *
   * @returns {Array}
   */
  this.getUrlParams = function () {
    var s = window.location.search.substring(1).split("&");
    var p = {};
    if (!s.length) {
      return p;
    }

    for (var i = 0; i < s.length; i++) {
      var parts = s[i].split("=");
      p[unescape(parts[0])] = unescape(parts[1]);
    }

    return p;
  };

  /**
   * Returns a single URL parameter
   *
   * @returns {String}
   */
  this.getUrlParam = function (parameter) {
    var parameters = this.getUrlParams();
    return typeof parameters[parameter] === "undefined"
      ? null
      : parameters[parameter];
  };

  /**
   * Returns the authenticated user
   * Key "AuthUser"
   * @returns {Array}
   */
  this.getAuthUser = function () {
    if (Registry.get("AuthUser") === null) {
      return null;
    }
    return Registry.get("AuthUser");
  };

  /**
   * Sets the authenticated user.
   * Key "AuthUser"
   *
   * @returns {Array}
   */
  this.setAuthUser = function (user) {
    return Registry.set("AuthUser", user);
  };

  /**
   * Returns the authentication token
   * Key "AuthToken"
   *
   * @returns {String}
   */
  this.getAuthToken = function () {
    return Registry.get("AuthToken");
  };

  /**
   * Sets the authentication token.
   * Key "AuthToken"
   *
   * @returns {Array}
   */
  this.setAuthToken = function (token) {
    return Registry.set("AuthToken", token);
  };
  
  /**
   * Returns the current language, if set.
   * Key "CurrentLanguage"
   * @returns {Array}
   */
  this.getLanguage = function () {
    var language = Registry.get("CurrentLanguage");
    if (language === null) {
      language = "en";
    }
    return language;
  };

  /**
   * Sets the current language.
   * Key "CurrentLanguage"
   * @returns {Array}
   */
  this.setLanguage = function (language) {
    return Registry.set("CurrentLanguage", language);
  };

  /**
   * Redirects the user to the specified URL
   *
   * Options:
   * - target = _blank - will open a new window
   *
   * @param {*} url
   * @param {*} data
   * @param {*} options
   * @returns
   */
  this.to = function (url, data, options) {
    if (url.match("^http://") || url.match("^https://")) {
      // External url
    } else {
      var url = rtrim(Config.getRootUrl(), ["/"]) + "/" + ltrim(url, ["/"]);
    }

    var queryString =
      typeof data === "undefined"
        ? ""
        : Object.keys(data)
            .map((key) => {
              return (
                encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
              );
            })
            .join("&");

    if (queryString.length > 0) {
      url = url + (url.indexOf("?") < 0 ? "?" : "&") + queryString;
    }

    var options = typeof options === "undefined" ? {} : options;

    if (options.target === "_blank") {
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      document.body.lastElementChild.click();
    } else {
      window.location.href = url;
    }

    return false; // otherwise links will be triggered
  };

  var topics = {},
    subUid = -1;

  this.publish = function (topic, args) {
    if (!topics[topic]) {
      return false;
    }

    setTimeout(function () {
      var subscribers = topics[topic],
        len = subscribers ? subscribers.length : 0;

      while (len--) {
        subscribers[len].func(topic, args);
      }
    }, 0);

    return true;
  };

  this.subscribe = function (topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    var token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func,
    });
    return token;
  };

  this.unsubscribe = function (token) {
    for (var m in topics) {
      if (topics[m]) {
        for (var i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return false;
  };

  function rtrim(str, charlist) {
    charlist = !charlist
      ? " \\s\u00A0"
      : (charlist + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "\\$1");
    var re = new RegExp("[" + charlist + "]+$", "g");
    return (str + "").replace(re, "");
  }

  function ltrim(str, charlist) {
    charlist = !charlist
      ? " \\s\u00A0"
      : (charlist + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "$1");
    var re = new RegExp("^[" + charlist + "]+", "g");
    return (str + "").replace(re, "");
  }
}

// Import Registry from the external package
if (typeof require !== 'undefined') {
  // Node.js environment
  try {
    const RegistryJS = require('@lesichkovm/registryjs');
    Registry = RegistryJS;
  } catch (e) {
    console.error('Failed to load @lesichkovm/registryjs:', e);
  }
} else {
  // Browser environment - assume the script is loaded via a script tag
  // Make sure to include the Registry script before this one
}

Config = new Config();
// Initialize Registry with the unique ID
Registry = new Registry(Config.getUniqueId());
$$ = new Initialize();
