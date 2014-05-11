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
    if (typeof module === 'object' && typeof module.exports === 'object') {
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

/*global JSRutils*/
(function(JSRutils) {
    "use strict";
    var Numeral = function() {

        var that = this,
            utils = JSRutils.Utils;

        /**
         * Get proper case with value
         * @param {number} amount Amount of objects
         * @param variants (forms) of object in such form: ['1 object', '2 objects', '5 objects']
         * @param absence If amount is zero will return it
         * @return String|undefined
         */
        this.getPlural = getPlural;

        /**
         * Choose proper case depending on amount
         * @param amount Amount of objects
         * @param variants Variants (forms) of object in such form: array('1 object', '2 objects', '5 objects')
         * @return String Proper variant
         * @throws TypeError if variants length less than 3
         */
        this.choosePlural = choosePlural;

        /**
         * Get sum in words
         * @param amount Amount of objects (> 0)
         * @param gender (1|2|3)
         * @param variants Variants (forms) of object in such form: ['1 object', '2 objects', '5 objects']
         * @return string representation objects' amount
         */
        this.sumString = sumString;

        /**
         * Integer in words
         * @param int amount Amount of objects
         * @param int gender (MALE, FEMALE or NEUTER)
         * @return string In-words representation of numeral
         */
        this.getInWordsInt = getInWordsInt;

        /**
         * Float in words
         * @param amount Amount of objects
         * @return In-words representation of float numeral
         */
        this.getInWordsFloat = getInWordsFloat;

        /**
         * Numeral in words
         * @param float amount Amount of objects
         * @param int|null gender (MALE, FEMALE, NEUTER or null)
         * @return string In-words representation of numeral
         */
        this.getInWords = getInWords;

        /**
         * Get string for money (RUB)
         * @param amount Amount of money
         * @param zeroForKopeck If false, then zero kopecks ignored
         * @return In-words representation of money's amount
         */
        this.getRubles = getRubles;


        // Private Methods

        function getPlural(amount, variants, absence) {
            var result;
            if (amount || typeof absence === "undefined") {
                result = JSRutils.formatNumber(amount) + " " + that.choosePlural(amount, variants);
            } else {
                result = absence;
            }
            return result;
        }

        function choosePlural(amount, variants) {
            if ((typeof amount !== "number") || !(variants instanceof Array) || variants.length < 2) {
                throw new TypeError("Invalid arguments passed");
            }
            var normalizeAmount = Math.abs(amount),
                mode10 = normalizeAmount % 10,
                mode100 = normalizeAmount % 100,
                variant = 0;

            if (mode10 === 1 && mode100 !== 11) {
                variant = 0;
            } else if (mode10 >= 2 && mode10 <= 4 && !(mode100 > 10 && mode100 < 20)) {
                variant = 1;
            } else {
                variant = 2;
            }
            return variants[variant];
        }

        function sumString(amount, gender, variants) {
            if (typeof variants === "undefined" || variants.length < 3) {
                variants = ['', '', ''];
            }
            amount = parseInt(amount);
            amount = amount < 0 ? 0 : amount;

            if (amount === 0) {
                return  utils.trim('ноль ' + variants[2]);
            } else {
                return getParts(amount, gender, variants);
            }
        }

        function getParts(amount, gender, variants) {
            var result = '',
                tmpVal = amount,
                data;

            //ones
            data = sumStringOneOrder(result, tmpVal, gender, variants);
            //thousands
            data = sumStringOneOrder(data[0], data[1], JSRutils.Female, ['тысяча', 'тысячи', 'тысяч']);
            //millions
            data = sumStringOneOrder(data[0], data[1], JSRutils.Male, ['миллион', 'миллиона', 'миллионов']);
            //billions
            data = sumStringOneOrder(data[0], data[1], JSRutils.Male, ['миллиард', 'миллиарда', 'миллиардов']);

            return utils.trim(data[0]);
        }

        function sumStringOneOrder(prevResult, tmpVal, gender, variants) {
            if (tmpVal === 0) {
                return [prevResult, tmpVal];
            }

            var words = [];
            var fiveItems = variants[2];
            var rest = tmpVal % 1000;

            tmpVal = Math.floor(tmpVal/1000);

            if (rest === 0) {
                if (prevResult === ''){
                    prevResult = fiveItems + ' ';
                }
                return [prevResult, tmpVal];
            }

            words.push(Config.HUNDREDS[Math.floor(rest/100)]);
            rest %= 100;

            var rest1 = Math.floor(rest/10),
                endWord,
                amount;

            if (rest1 === 1) {
                words.push(Config.TENS[rest]);
            } else {
                words.push(Config.TENS[rest1]);
            }

            if (rest1 === 1) {
                endWord = fiveItems;
            } else {
                amount = rest%10;
                words.push(Config.ONES[amount][gender-1]);
                endWord = that.choosePlural(amount, variants);
            }

            words.push(endWord, prevResult);
            words = utils.arrayFilter(words, function(word){
                return word.length > 0;
            });

            return [utils.trim(words.join(' ')), tmpVal];
        }

        function getInWords(amount, gender) {
            gender = gender || JSRutils.Male;
            if (amount === Math.floor(amount)) {
                return that.getInWordsInt(amount, gender);
            } else {
                return that.getInWordsFloat(amount);
            }
        }

        function getInWordsInt(amount, gender) {
            gender = gender || JSRutils.Male;
            amount = Math.round(amount);
            return that.sumString(amount, gender);
        }

        function getInWordsFloat(amount) {
            var words = [],
                intPart = Math.floor(amount),
                pointVariants = ['целая', 'целых', 'целых'],
                remainder = getFloatRemainder(amount),
                signs = remainder.length - 1;

            words.push(
                that.sumString(intPart, JSRutils.Female, pointVariants),
                that.sumString(remainder, JSRutils.Female, Config.FRACTIONS[signs])
            );
            return utils.trim(words.join(' '));
        }

        function getFloatRemainder(value, signs) {
            signs = signs || 9;
            if (value === Math.floor(value)) {
                return '0';
            }
            signs = Math.min(signs, Config.FRACTIONS.length);
            value = value.toFixed(signs);
            var remainder = value.split('.')[1].replace(/0+$/, '');
            return remainder || '0';
        }

        function getRubles(amount, zeroForKopeck) {
            amount = typeof amount !== "number" || amount < 0 ? 0 : parseFloat(amount);
            zeroForKopeck = zeroForKopeck || false;

            var words = [],
                iAmount = Math.floor(amount),
                remainder = getFloatRemainder(amount, 2);

            if (iAmount > 0) {
                words.push(that.sumString(iAmount, JSRutils.Male, ['рубль', 'рубля', 'рублей']));
            }

            if (remainder > 0 || zeroForKopeck) {
                if (remainder < 10 && remainder.length === 1) {
                    remainder = parseInt(remainder) * 10;
                }
                words.push(
                    that.sumString(remainder, JSRutils.Female, ['копейка', 'копейки', 'копеек'])
                );
            }
            return utils.trim(words.join(" "));
        }
    };

    var Config = {
        FRACTIONS : [
            ['десятая', 'десятых', 'десятых'],
            ['сотая', 'сотых', 'сотых'],
            ['тысячная', 'тысячных', 'тысячных'],
            ['десятитысячная', 'десятитысячных', 'десятитысячных'],
            ['стотысячная', 'стотысячных', 'стотысячных'],
            ['миллионная', 'милллионных', 'милллионных'],
            ['десятимиллионная', 'десятимилллионных', 'десятимиллионных'],
            ['стомиллионная', 'стомилллионных', 'стомиллионных'],
            ['миллиардная', 'миллиардных', 'миллиардных']
        ],
        ONES : [
            ['', '', ''],
            ['один', 'одна', 'одно'],
            ['два', 'две', 'два'],
            ['три', 'три', 'три'],
            ['четыре', 'четыре', 'четыре'],
            ['пять', 'пять', 'пять'],
            ['шесть', 'шесть', 'шесть'],
            ['семь', 'семь', 'семь'],
            ['восемь', 'восемь', 'восемь'],
            ['девять', 'девять', 'девять']
        ],
        TENS : ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать','четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
        HUNDREDS : ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот']
    };

    JSRutils.NumeralClass = Numeral;
    JSRutils.Numeral = new Numeral();
})(JSRutils);

/*global JSRutils*/
(function (JSRutils) {
    'use strict';
    var Dt = function () {
    };

    // Constants
    Dt.prototype.PREFIX_IN = 'через'; // Prefix 'in' (i.e. B{in} three hours)
    Dt.prototype.PREFIX_AGO = 'назад'; // Prefix 'ago' (i.e. three hours B{ago})
    Dt.prototype.DAY_NAMES = [
        ['вск', 'воскресенье', 'воскресенье', 'в\u00a0'],
        ['пн', 'понедельник', 'понедельник', 'в\u00a0'],
        ['вт', 'вторник', 'вторник', 'во\u00a0'],
        ['ср', 'среда', 'среду', 'в\u00a0'],
        ['чт', 'четверг', 'четверг', 'в\u00a0'],
        ['пт', 'пятница', 'пятницу', 'в\u00a0'],
        ['сб', 'суббота', 'субботу', 'в\u00a0']
    ]; // Day alternatives (i.e. one day ago -> yesterday)
    Dt.prototype.MONTH_NAMES = [
        ['янв', 'январь', 'января'],
        ['фев', 'февраль', 'февраля'],
        ['мар', 'март', 'марта'],
        ['апр', 'апрель', 'апреля'],
        ['май', 'май', 'мая'],
        ['июн', 'июнь', 'июня'],
        ['июл', 'июль', 'июля'],
        ['авг', 'август', 'августа'],
        ['сен', 'сентябрь', 'сентября'],
        ['окт', 'октябрь', 'октября'],
        ['ноя', 'ноябрь', 'ноября'],
        ['дек', 'декабрь', 'декабря']
    ]; // Forms (1, 2, 5) for noun 'day'
    Dt.prototype.PAST_ALTERNATIVES = ['вчера', 'позавчера'];
    Dt.prototype.YEAR_VARIANTS = ['год', 'года', 'лет']; // Forms (1, 2, 5] for noun 'year'
    Dt.prototype.MONTH_VARIANTS = ['месяц', 'месяца', 'месяцев'];
    Dt.prototype.DAY_VARIANTS = ['день', 'дня', 'дней'];
    Dt.prototype.HOUR_VARIANTS = ['час', 'часа', 'часов'];
    Dt.prototype.MINUTE_VARIANTS = ['минуту', 'минуты', 'минут'];
    Dt.prototype.DISTANCE_FIELDS = ['y', 'm', 'd', 'h', 'i'];

    /**
     * Create date string by format. Format tokens:
     * %Y - full year like 2014
     * %m - month like 01
     * %d - date like 01
     * %H - hours
     * %i - minutes
     * %s - seconds
     * %D - day of week like пн
     * %l - day of week like понедельник
     * %M - month like апр
     * %F - month like апрель
     * @param options
     * @returns {string}
     */
    Dt.prototype.ruStrFTime = function (options) {
        var defaults = {
            format: '%l, %d %M %Y %H:%i:%s',
            date: null,
            monthInflected: false,
            dayInflected: false,
            preposition: false
        };
        options = JSRutils.Utils.mergeObjects(defaults, options);

        var date = this.createDate(options.date);
        var formatRegexp = /%(?:Y|m|d|H|i|s|D|l|M|F)/g;

        var result = options.format;
        var replaced = [];
        var replaceXxInResult = function (needle, val) {
            result = result.replace(needle, (val >= 10 ? val.toString() : '0' + val));
        };

        var matches = formatRegexp.exec(options.format);
        var needle, pattern;
        var replacement;
        while (matches) {
            needle = matches[0];
            if (replaced.indexOf(needle) === -1) {
                pattern = new RegExp(needle, 'g');
                //noinspection FallthroughInSwitchStatementJS
                switch (needle) {
                    case '%Y':
                        result = result.replace(pattern, date.getFullYear().toString());
                        break;
                    case '%m':
                        replaceXxInResult(pattern, date.getMonth() + 1);
                        break;
                    case '%d':
                        if (options.format.indexOf('%M') === -1 && options.format.indexOf('%F') === -1) {
                            replaceXxInResult(pattern, date.getDate());
                        }
                        else {
                            result = result.replace(pattern, date.getDate().toString());
                        }
                        break;
                    case '%H':
                        replaceXxInResult(pattern, date.getHours());
                        break;
                    case '%i':
                        replaceXxInResult(pattern, date.getMinutes());
                        break;
                    case '%s':
                        replaceXxInResult(pattern, date.getSeconds());
                        break;
                    case '%D':
                    case '%l':
                        var weekDay = date.getDay();
                        var preposition = options.preposition ? this.DAY_NAMES[weekDay][3] : '';
                        if (needle === '%D') {
                            replacement = preposition + this.DAY_NAMES[weekDay][0];
                        } else {
                            var dayIdx = (options.dayInflected || options.preposition) ? 2 : 1;
                            replacement = preposition + this.DAY_NAMES[weekDay][dayIdx];
                        }
                        result = result.replace(pattern, replacement);
                        break;
                    case '%M':
                    case '%F':
                        var month = date.getMonth();
                        if (needle === '%M') {
                            replacement = this.MONTH_NAMES[month][0];
                        } else {
                            var monthIdx = options.monthInflected ? 2 : 1;
                            replacement = this.MONTH_NAMES[month][monthIdx];
                        }
                        result = result.replace(pattern, replacement);
                        break;
                }
                replaced.push(needle);
            }
            matches = formatRegexp.exec(options.format);
        }
        return result;
    };

    /**
     * Create Date object from different date-time forms
     * @param spec
     * @returns {Date}
     */
    Dt.prototype.createDate = function (spec) {
        var result;
        if (spec instanceof Date || typeof spec === 'number') {
            result = new Date(spec);
        } else if (spec === null || spec === undefined) {
            result = new Date();
        } else if (typeof spec === 'string') {
            var time = Date.parse(spec);
            if (isNaN(time)) {
                throw new SyntaxError('Invalid date string');
            }
            result = new Date(time);
        } else {
            throw new TypeError('Invalid date specification type');
        }
        return result;
    };

    JSRutils.DtClass = Dt;
    JSRutils.Dt = new Dt();
})(JSRutils);
