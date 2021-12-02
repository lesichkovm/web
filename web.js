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
     * Returns the current language.
     * Key "CurrentLanguage"
     * @returns {Array}
     */
    this.setLanguage = function (language) {
        return Registry.set("CurrentLanguage", language);
    };

    this.getLanguage = function () {
        var language = Registry.get("CurrentLanguage");
        if (language === null) {
            language = "en";
        }
        return language;
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
            var link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.style.display = "none";
            document.body.appendChild(link);
            document.body.lastElementChild.click();
        } else {
            window.location.href = url;
        }

        return false; // otherwise links will be triggered
    };

    var topics = {}, subUid = -1;

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
            func: func
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

Config = new Config();
Registry = new Registry(Config.getUniqueId());
$$ = new Initialize();