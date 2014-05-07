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
            else if (typeof callback === "function") {
                var result = [];
                var func = callback.bind(thisArg);
                for (var i = 0, max = array.length; i < max; i++) {
                    if (func(array[i])) {
                        result.push(array[i]);
                    }
                }
                return result;
            }
            else {
                return [];
            }
        }
    };
})(JSRutils);
