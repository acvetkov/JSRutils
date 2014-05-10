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
