/*global JSRutils*/
(function() {
    "use strict";
    JSRutils.Utils = {
        trim : function(string) {
            if (typeof string.trim === "function") {
                return string.trim();
            }
            if (typeof string !== "string") {
                return string;
            }
            return string.replace(/^[\s\r\n]+|[\s\r\n]+$/g, "");
        },
        arrayFilter : function(array, callback, thisArg) {
            var result = [];
            for (var i = 0, max = array.length; i < max; i++) {
                if (typeof callback === "function" && callback.call(thisArg, array[i])) {
                    result.push(array[i]);
                }
            }
            return result;
        }
    };
})();
