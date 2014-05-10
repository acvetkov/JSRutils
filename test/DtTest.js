/*global describe, it, JSRutils*/
if (typeof JSRutils === 'undefined') {
    var JSRutils = require('../build/JSRutils.min.js').JSRutils;
}
if (typeof assert === 'undefined') {
    var chai = require('chai');
    var assert = chai.assert;
}

(function () {
    'use strict';
    describe('JSRutils.Dt test', function () {
        it('covers JSRutils.Dt.createDate from Date object', function () {
            var srcDate = new Date();
            var date = JSRutils.Dt.createDate(srcDate);
            assert.equal(date.getTime(), srcDate.getTime());
        });

        it('covers JSRutils.Dt.createDate from number', function () {
            var srcDate = new Date();
            var date = JSRutils.Dt.createDate(srcDate.getTime());
            assert.equal(date.getTime(), srcDate.getTime());
        });

        it('covers JSRutils.Dt.createDate now time', function () {
            var srcDate = new Date();
            var date = JSRutils.Dt.createDate(undefined);
            assert.equal(date.getTime(), srcDate.getTime());
        });

        it('covers JSRutils.Dt.createDate from string', function () {
            var strDate = '2013-01-01T11:40:00';
            var srcDate = new Date(strDate);
            var date = JSRutils.Dt.createDate(strDate);
            assert.equal(date.getTime(), srcDate.getTime());
        });

        it('covers JSRutils.Dt.createDate error with invalid string', function () {
            var strDate = 'invalid string';
            try {
                JSRutils.Dt.createDate(strDate);
                assert.fail();
            } catch (e) {
                assert.instanceOf(e, SyntaxError);
                assert.equal(e.message, 'Invalid date string');
            }
        });

        it('covers JSRutils.Dt.ruStrFTime fixed', function () {
            var testData = {
                '%d.%m.%Y': '01.01.1988',
                'тест %D': 'тест пт',
                'тест %l': 'тест пятница',
                'тест %M': 'тест янв',
                'тест %F': 'тест январь',
                '%d %M %Y': '1 янв 1988',
                '%d %F %Y': '1 январь 1988'
            };

            var params = {
                date: '1988-01-01T06:40:34'
            };
            testVariants(params, testData);
        });

        it('covers JSRutils.Dt.ruStrFTime repeated patterns', function () {
            var testData = {
                '%d.%m.%Y %d.%m.%Y': '01.01.1988 01.01.1988'
            };

            var params = {
                date: '1988-01-01T06:40:34'
            };
            testVariants(params, testData);
        });

        it('covers JSRutils.Dt.ruStrFTime preposition', function () {
            var testData = {
                'тест %D': 'тест в\u00a0пт',
                'тест %l': 'тест в\u00a0пятницу'
            };

            var params = {
                date: '1988-01-01T06:40:34',
                preposition: true
            };
            testVariants(params, testData);
        });

        it('covers JSRutils.Dt.ruStrFTime inflected', function () {
            var testData = {
                'тест %M': 'тест янв',
                'тест %F': 'тест января',
                '%d %M %Y': '1 янв 1988',
                '%d %F %Y': '1 января 1988',
                'тест выполнен %d %F %Y года': 'тест выполнен 1 января 1988 года',
                'тестируем %D': 'тестируем пт',
                'тестируем %l': 'тестируем пятницу'
            };

            var params = {
                date: '1988-01-01T06:40:34',
                dayInflected: true,
                monthInflected: true
            };
            testVariants(params, testData);
        });

        function testVariants(params, testData) {
            var result;
            for (var format in testData) {
                if (testData.hasOwnProperty(format)) {
                    params.format = format;
                    result = JSRutils.Dt.ruStrFTime(params);
                    assert.equal(result, testData[format]);
                }
            }
        }
    });
})();
