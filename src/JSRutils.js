var JSRutils;
(function () {
    'use strict';
    JSRutils = {
        Male: 1,
        Female: 2,
        Neuter: 3,

        /**
         * Format number with russian locale
         * @param number
         * @param separator symbol between number parts
         * @returns {string}
         */
        formatNumber: formatNumber
    };
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.JSRutils = JSRutils;
    }

    function formatNumber(number) {
        var strNum = parseFloat(number)
                .toString()
                .replace('.', ','),
            result = '',
            length = strNum.length;

        for (var i = 1; i <= length; ++i) {
            result = strNum[length - i] + result;
            if (i % 3 === 0 && i !== length) {
                result = " " + result;
            }
        }
        return result;
    }
})();
