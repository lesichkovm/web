function Config() {
  this.getUniqueId = function () {
    return typeof APP_ID == "undefined"
      ? JSON.stringify(window.location.hostname)
      : API_ID;
  };
  this.getRootUrl = function () {
    return typeof WEBSITE_ID == "undefined"
      ? window.location.protocol + "//" + window.location.hostname +
        (window.location.port ? ":" + location.port : "")
      : WEBSITE_URL;
  };
  this.getApiUrl = function () {
    return typeof API_URL == "undefined"
      ? window.location.protocol + "//" + window.location.hostname +
        (location.port ? ":" + window.location.port : "") +
        "/api"
      : API_URL;
  };
}

function Registry(namespace) {
  var namespace = typeof namespace === "undefined"
    ? jsonEncode(window.location.hostname)
    : "@" + namespace;
  var defaultPassword =
    "8pVbaKePV3beCUZYbKSfujzucbcD3eqyJvCAUgQL8PbYe3VmAMSKC9esx8jV8M7KegPsxkDTpUKvu2UenQyPPjsDf92XnjtZh5GJRz8bQHZngNGKenKZHDD8";
  var password = (namespace == "") ? namespace : defaultPassword;

  function jsonDecode(json) {
    return JSON.parse(json);
  }

  function jsonEncode(string) {
    return JSON.stringify(string);
  }

  /**
   * Gets a key from the key-vaue store, if it does not exist returns NULL
   * @param {string} key
   * @returns {Object}
   */
  this.get = function (key) {
    var key = key + namespace;
    if (localStorage.getItem(key) !== null) {
      var expiresDate = localStorage.getItem(key + "&&expires");
      if (expiresDate === null) {
        return null;
      }
      var expires = new Date(expiresDate);
      var now = new Date();
      var isExpired = now.getTime() > expires.getTime() ? true : false;
      if (isExpired) {
        this.remove(key);
        return null;
      }
      var value = window.localStorage.getItem(key);
      if (value === null) {
        return value;
      }
      if (value === "undefined") {
        return null;
      }
      if (typeof value === "undefined") {
        value = null;
        return null;
      }

      var value = jsonDecode(value);
      return this.decrypt(value);
    } else {
      return null;
    }
  };
  /**
   * Sets a value to a key
   * @param {string} key
   * @param {Object} value
   * @param {number} expires
   * @returns {void}
   */
  this.set = function (key, value, expires) {
    // console.log(key);
    // console.log(value);
    if (typeof value === "undefined") {
      value = null;
    }
    var expires = typeof expires === "undefined" ? 60000000000 : expires * 1000;
    var key = key + namespace;
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      var encValue = this.encrypt(value);
      localStorage.setItem(key, jsonEncode(encValue));
      var expiresTime = ((new Date()).getTime() + expires);
      var expires = new Date();
      expires.setTime(expiresTime);
      localStorage.setItem(key + "&&expires", expires);
    }
  };
  this.remove = function (key) {
    var key = key + namespace;
    localStorage.removeItem(key);
    localStorage.removeItem(key + "&&expires");
  };
  this.empty = function () {
    var keys = Object.keys(localStorage);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key.indexOf(namespace) > -1) {
        localStorage.removeItem(key);
      }
    }
  };

  /**
   * Encrypts an object to a string
   * @return string
   */
  this.encrypt = function (obj) {
    var jsonString = JSON.stringify(obj);

    var result = [];
    var passLen = password.length;
    for (var i = 0; i < jsonString.length; i++) {
      var passOffset = i % passLen;
      var calAscii =
        (jsonString.charCodeAt(i) + password.charCodeAt(passOffset));
      result.push(calAscii);
    }
    return JSON.stringify(result);
  };

  /**
   * Decrypts an string to the original object
   * @return object
   */
  this.decrypt = function (encStr) {
    var result = [];
    var str = "";
    var codesArr = JSON.parse(encStr);
    var passLen = password.length;
    for (var i = 0; i < codesArr.length; i++) {
      var passOffset = i % passLen;
      var calAscii = (codesArr[i] - password.charCodeAt(passOffset));
      result.push(calAscii);
    }
    for (var i = 0; i < result.length; i++) {
      var ch = String.fromCharCode(result[i]);
      str += ch;
    }

    var result = JSON.parse(str);
    return result;
  };
}

// function dd() {
//   /* START: Initialize */
//   Config = new Config();
//   Registry = new Registry(Config.getUniqueId());
//   Helper = new Helper();
//   $$ = new Initialize();
//   /* END: Initialize */

//   $("base").attr("href", Config.getRootUrl());

//   /* START: Check token */
//   $(document).ajaxSuccess(function (evt, jqXHR, settings) {
//     var json = jqXHR.responseJSON;
//     if (typeof json !== "undefined") {
//       var status = json.status.toLowerCase();
//       if (
//         status === "authenticationfailure" || status === "authentication_failed"
//       ) {
//         var message = json.message.toLowerCase();
//         $$.setUser(null);
//         $$.setToken(null);
//         Registry.set("LoginError", message);
//         $.publish("authentication_failed", message);
//         //$$.to('guest/auth/login.html?message=' + message);
//         //$$.to('guest/home.html?message=' + message);
//       }
//     }
//   });
//   /* END: Check token */

//   loadWidgets();
//   loadImages();
// }

function Helper() {
  this.base36Encode = function (number) {
    return parseInt(number).toString(36).toUpperCase();
  };

  this.jsonDecode = function (json) {
    return JSON.parse(json);
  };

  this.jsonEncode = function (string) {
    return JSON.stringify(string);
  };
}

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
   * @returns {Array}
   */
  this.getAuthUser = function () {
    if (Registry.get("AuthUser") === null) {
      return null;
    }
    return Registry.get("AuthUser");
  };

  this.setAuthUser = function (user) {
    return Registry.set("AuthUser", user);
  };

  this.setLanguage = function (language) {
    return Registry.set("CurrentLanguage", language);
  };

  this.setAuthToken = function (token) {
    return Registry.set("AuthToken", token);
  };

  /**
    * Returns the authentication token
    *
    * @returns {String}
    */
  this.getAuthToken = function () {
    return Registry.get("AuthToken");
  };

  this.getLanguage = function () {
    var language = Registry.get("CurrentLanguage");
    if (language === null) {
      language = "en";
    }
    return language;
  };

  this.to = function (url, data, options) {
    if (url.match("^http://") || url.match("^https://")) {
      // External url
    } else {
      var url = rtrim(Config.getRootUrl(), ["/"]) + "/" + ltrim(url, ["/"]);
    }

    var queryString = (typeof data === "undefined")
      ? ""
      : Object.keys(data).map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      }).join("&");

    if (queryString.length > 0) {
      url = url + (url.indexOf("?") < 0 ? "?" : "&") + queryString;
    }

    var options = (typeof options === "undefined") ? {} : options;

    if (options.target === "_blank") {
      var link = $(
        "<a />",
        { "href": url, "target": "_blank", "style": "display:none;" },
      );
      $("body").append(link);
      link.get(0).click();
    } else {
      window.location.href = url;
    }

    return false; // otherwise links will be triggered
  };

  this.ws = function (command, data) {
    if (typeof command !== "string") {
      return console.log("command must be a string");
    }

    var data = (typeof data === "undefined") ? {} : data;
    var cmd = trim(command, "/");
    var token = this.getAuthToken();
    if (token !== null) {
      if (typeof data === "string" || data instanceof String) {
        data += ("&_auth=" + token);
      } else {
        data["_auth"] = token;
      }
    }

    var url = Config.getApiUrl();

    if (Config.getApiUrl().endsWith("/") || cmd.endsWith(".json")) {
      url += "?command=" + cmd + "&ts=" + Math.round(+new Date() / 1000);
    } else {
      url = rtrim(url, "/");
      url += "/" + cmd + "/?ts=" + Math.round(+new Date() / 1000);
    }
    var dataType = cmd.endsWith(".json") ? "json" : "jsonp";

    const getFormData = (object) =>
      Object.keys(object).reduce((formData, key) => {
        formData.append(key, object[key]);
        return formData;
      }, new FormData());

    return fetch(url, {
      method: "POST",
      //body: JSON.stringify(data),
      body: getFormData(data),
      credentials: "include",
      redirect: "follow",
      headers: {
        "Accept": "application/json, text/plain, */*",
        //"Content-type": "application/json; charset=UTF-8",
      },
      //referrer: "about:client", // or "" to send no Referer header,
      // or an url from the current origin
      //referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
      //mode: "cors", // same-origin, no-cors
      //credentials: "same-origin", // omit, include
      //cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
      //redirect: "follow", // manual, error
      //integrity: "", // a hash, like "sha256-abcdef1234567890"
      //keepalive: false, // true
      //signal: undefined, // AbortController to abort request
      //window: window, // null
    }).then((res) => res.text())
      .then((responseText) => {
        if (responseText.endsWith(";") == false) {
          return JSON.parse(responseText);
        }
        const match = responseText.match(/(?<=\()(.*)(?=\))/);
        if (!match) throw new Error("Invalid JSONP response");
        return JSON.parse(match[0]);
      });

    // var p = $.ajax({
    //   type: "POST",
    //   url: url,
    //   crossDomain: true,
    //   cache: false,
    //   dataType: dataType,
    //   data: data,
    // });
    // return p;
  };

  /**
   * Logs a message
   * @param {Object} msg
   * @returns {void}
   */
  this.log = function (msg) {
    if (debug === true) {
      console.log(msg);
    }
  };
  /* END: Public Scope */

  /**
     * Loads a template sinchronously and returns the content
     * @param {type} url
     * @returns {String}
     */
  //   this.getTemplateHtml = function (url) {
  //     var result = "";
  //     $.ajax({
  //       url: url,
  //       async: false,
  //       dataType: "text",
  //       crossDomain: "true",
  //       beforeSend: function (xhr) {
  //         xhr.overrideMimeType("text/plain; charset=x-user-defined");
  //       },
  //     }).done(function (html) {
  //       result = html;
  //     });
  //     return result;
  //   };

  return this;

  function ltrim(str, charlist) {
    charlist = !charlist
      ? " \\s\u00A0"
      : (charlist + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "$1");
    var re = new RegExp("^[" + charlist + "]+", "g");
    return (str + "").replace(re, "");
  }

  function rtrim(str, charlist) {
    charlist = !charlist
      ? " \\s\u00A0"
      : (charlist + "").replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "\\$1");
    var re = new RegExp("[" + charlist + "]+$", "g");
    return (str + "").replace(re, "");
  }

  function trim(str, charlist) {
    var whitespace =
      " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    var l = 0;
    str += "";

    if (charlist) {
      // preg_quote custom list
      charlist += "";
      whitespace = charlist.replace(
        /([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g,
        "$1",
      );
    }

    for (var i = 0; i < str.length; i++) {
      if (whitespace.indexOf(str.charAt(i)) === -1) {
        str = str.substring(i);
        break;
      }
    }

    for (var i = str.length - 1; i >= 0; i--) {
      if (whitespace.indexOf(str.charAt(i)) === -1) {
        str = str.substring(0, i + 1);
        break;
      }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : "";
  }
}

// New Init
Config = new Config();
Registry = new Registry(Config.getUniqueId());
Helper = new Helper();
$$ = new Initialize();
