/* jshint ignore:start */

if (typeof Object.create !== "function") {
    Object.create = function (proto, propertiesObject) {
        if (!(proto === null || typeof proto === "object" || typeof proto === "function")) {
            throw TypeError('Argument must be an object, or null');
        }
        var temp = new Object();
        temp.__proto__ = proto;
        Object.defineProperties(temp, propertiesObject);
        return temp;
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function () {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
  Array.prototype.some = function(fun/*, thisArg*/) {
    'use strict';

    if (this == null) {
      throw new TypeError('Array.prototype.some called on null or undefined');
    }

    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

/* jshint ignore:end */
