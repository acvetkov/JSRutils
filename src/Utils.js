/*global JSRutils*/
(function (JSRutils) {
    "use strict";
    JSRutils.Utils = {
        trim: function (string) {
            if (typeof string.trim === "function") {
                return string.trim();
            }
            if (typeof string !== "string") {
                return string;
            }
            return string.replace(/^[\s\r\n]+|[\s\r\n]+$/g, "");
        },
        arrayFilter: function (array, callback, thisArg) {
            if (typeof array.filter === "function") {
                return array.filter(callback, thisArg);
            }
            if (typeof callback === "function") {
                var result = [];
                var func = callback.bind(thisArg);
                for (var i = 0, max = array.length; i < max; i++) {
                    if (func(array[i])) {
                        result.push(array[i]);
                    }
                }
                return result;
            } else {
                return [];
            }
        },
        isDict: function (val) {
            var isPrimitive;
            var type = typeof val;
            if (type === 'object' && val !== null) {
                // is array-like object?
                isPrimitive = (val instanceof Array) || (typeof val.length === 'number' && (val.length - 1) in val);
            } else {
                // is scalar?
                isPrimitive = (type === 'number' || type === 'string' || type === 'boolean' || type === 'function' || val === null || val === undefined);
            }
            return !isPrimitive;
        },
        mergeObjects: function (dst, src) {
            if (dst && src) {
                if (this.isDict(dst) && this.isDict(src)) {
                    var val;
                    for (var key in src) {
                        if (src.hasOwnProperty(key)) {
                            val = src[key];
                            if (dst.hasOwnProperty(key) && this.isDict(dst[key]) && this.isDict(val)) {
                                dst[key] = this.mergeObjects(dst[key], src[key]);
                            } else {
                                dst[key] = val;
                            }
                        }
                    }
                } else {
                    dst = src;
                }
            }
            return dst;
        }
    };
})(JSRutils);
