$(function () {
    /* START: Initialize */
    Config = new Config();
    Registry = new Registry(Config.getUniqueId());
    Helper = new Helper();
    $$ = new Initialize();
    /* END: Initialize */
    
    $('base').attr('href', Config.getRootUrl());

    /* START: Check token */
    $(document).ajaxSuccess(function (evt, jqXHR, settings) {
        var json = jqXHR.responseJSON
        if (typeof json !== "undefined") {
            var status = json.status.toLowerCase();
            if (status === "authenticationfailure" || status === "authentication_failed") {
                var message = json.message.toLowerCase();
                $$.setUser(null);
                $$.setToken(null);
                Registry.set('LoginError', message);
                $.publish('authentication_failed', message);
                //$$.to('guest/auth/login.html?message=' + message);
                //$$.to('guest/home.html?message=' + message);
            }
        }
    });
    /* END: Check token */
    
    loadWidgets();
    loadImages();
});

/* START: Publish-Subscribe */
$(function ($) {
    var o = $({});
    $.subscribe = function () {
        o.on.apply(o, arguments);
    };
    $.unsubscribe = function () {
        o.off.apply(o, arguments);
    };
    $.publish = function () {
        o.trigger.apply(o, arguments);
    };
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
});
/* END: Publish-Subscribe */

/**
 * Loads images with specified "data-src" attribute
 */
function loadImages() {
    $('img[data-src]').each(function () {
        var src = $(this).data('src');
        var style = $(this).data('style');
        $(this).attr('src',src);
        $(this).attr('style',style);
    });
}

function loadWidgets() {
    $('div[data-widget-url]').each(function () {
        var url = $(this).data('widget-url');
        $(this).load(url);
    });
    $('div[data-background-image]').each(function () {
        var url = $(this).data('background-image');
        $(this).find('span.fa-spin').hide();
        $(this).css('background-image', 'url(' + url + ')');
    });
}

function Config() {
    this.getUniqueId = function () {
        return APP_ID;
    };
    this.getRootUrl = function () {
        return WEBSITE_URL;
    };
    this.getApiUrl = function () {
        return API_URL; // Local proxy script to allow Ajax cross-domain
    };
}

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

    /**
     * Loads a template sinchronously and returns the content
     * @param {type} url
     * @returns {String}
     */
    this.getTemplate = function (url) {
        var result = '';
        $.ajax({url: url, async: false, dataType: "text", crossDomain: "true", beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        }).done(function (html) {
            result = html;
        });
        return result;
    };

    /**
     * Loads a JSON file sinchronously and returns the content
     * @param {type} url
     * @returns {String}
     */
    this.getJson = function (url) {
        var result = '';
        $.ajax({url: url, async: false, dataType: "text", crossDomain: "true", beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        }).done(function (json) {
            result = json;
        });
        return result;
    };
}

function Registry(namespace) {
    var namespace = typeof namespace === "undefined" ? '' : "@" + namespace;

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

            return jsonDecode(value);
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
        console.log(key);
        console.log(value);
        if (typeof value === "undefined") {
            value = null;
        }
        var expires = typeof expires === "undefined" ? 60000000000 : expires * 1000;
        var key = key + namespace;
        if (value === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, jsonEncode(value));
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
}


/**
 * Initialize
 * @type $$
 */
function Initialize() {
    /* START: Public Scope */
    this.debug = true;

    /**
     * Returns the current URL
     * @returns {String}
     */
    this.getUrl = function () {
        return window.location.href;
    };

    /**
     * Returns the URL parameters
     * @returns {Array}
     */
    this.getUrlParams = function () {
        var s = window.location.search.substring(1).split('&');
        var p = {};
        if (!s.length) {
            return p;
        }

        for (var i = 0; i < s.length; i++) {
            var parts = s[i].split('=');
            p[unescape(parts[0])] = unescape(parts[1]);

        }

        return p;
    };

    this.getUrlParam = function (parameter) {
        var parameters = this.getUrlParams();
        return typeof parameters[parameter] === "undefined" ? null : parameters[parameter];
    };

    /**
     * @returns {Array}
     */
    this.getUser = function () {
        if (Registry.get('AuthUser') === null) {
            return null;
        }
        return Registry.get('AuthUser');
    };

    this.setUser = function (user) {
        return Registry.set('AuthUser', user);
    };

    this.setLanguage = function (language) {
        return Registry.set('CurrentLanguage', language);
    };

    this.setToken = function (token) {
        return Registry.set('AuthToken', token);
    };

    this.getToken = function () {
        return Registry.get('AuthToken')
    };

    this.getLanguage = function () {
        var language = Registry.get('CurrentLanguage')
        if (language === null) {
            language = 'en';
        }
        return language;
    };

    this.to = function (url, data) {
        if (url.match("^http://") || url.match("^https://")) {
            // External url
        } else {
            var url = rtrim(Config.getRootUrl(), ['/']) + '/' + ltrim(url, ['/']);
        }
        var queryString = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');
        if(data && data.length>0) {
            window.location.href = url + '?' + queryString;
        } else {
            window.location.href = url;
        }
        
        return false; // otherwise links will be triggered
    };

    this.ws = function (command, data) {
        var token = this.getToken();
        if (token !== null) {
            if (typeof data === 'string' || data instanceof String) {
                data += ("&Token=" + token);
            } else {
                data["Token"] = token;
            }
        }
        var url = "";
        if (Config.getApiUrl().endsWith('/')) {
            url = Config.getApiUrl() + '?command=' + command + '&ts=' + Math.round(+new Date() / 1000);
        } else {
            url = Config.getApiUrl() + '/' + command + '/?ts=' + Math.round(+new Date() / 1000);
        }
        var p = $.ajax({
            type: 'POST',
            url: url,
            crossDomain: true,
            cache: false,
            dataType: 'jsonp',
            data: data
        });
        return p;
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
    this.getTemplateHtml = function (url) {
        var result = '';
        $.ajax({
            url: url,
            async: false,
            dataType: "text",
            crossDomain: "true",
            beforeSend: function (xhr) {
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }
        }).done(function (html) {
            result = html;
        });
        return result;
    };

    return this;

    function ltrim(str, charlist) {
        charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
        var re = new RegExp('^[' + charlist + ']+', 'g');
        return (str + '').replace(re, '');
    }

    function rtrim(str, charlist) {
        charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
        var re = new RegExp('[' + charlist + ']+$', 'g');
        return (str + '').replace(re, '');
    }

    function trim(str, charlist) {
        var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
        var l = 0;
        str += '';

        if (charlist) {
            // preg_quote custom list
            charlist += '';
            whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
        }

        l = str.length;
        for (var i = 0; i < l; i++) {
            if (whitespace.indexOf(str.charAt(i)) === -1) {
                str = str.substring(i);
                break;
            }
        }

        l = str.length;
        for (var i = l - 1; i >= 0; i--) {
            if (whitespace.indexOf(str.charAt(i)) === -1) {
                str = str.substring(0, i + 1);
                break;
            }
        }

        return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
    }

}
