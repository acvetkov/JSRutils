/*global describe, it*/
(function () {
    'use strict';
    if (typeof JSRutils === 'undefined') {
        var JSRutils = require('../build/JSRutils.min.js').JSRutils;
    }
    if (typeof assert === 'undefined') {
        var chai = require('chai');
        var assert = chai.assert;
    }


    describe('JSRutils.Utils test', function () {
        it('covers JSRutils.Utils.trim', function () {
            assert.equal(JSRutils.Utils.trim('\r \n \r\n 123 \r\n '), '123');
        });

        it('covers JSRutils.Utils.arrayFilter correct result', function () {
            var testArr = [];
            for (var i = 1; i <= 10; ++i) {
                testArr.push(i);
            }
            assert.deepEqual(
                JSRutils.Utils.arrayFilter(testArr, function (elem) {
                    return elem % 2 === 0;
                }),
                [2, 4, 6, 8, 10]
            );
        });

        it('covers JSRutils.Utils.arrayFilter thisArg', function () {
            var expectedThisArg = {};
            var actualThisArg = null;
            JSRutils.Utils.arrayFilter([1, 2, 3], function () {
                actualThisArg = this;
                return false;
            }, expectedThisArg);
            assert.strictEqual(expectedThisArg, actualThisArg);
        });

        it('covers JSRutils.Utils.isDict', function () {
            var ArrayLike = function () {
                this.length = 0;
                for (var i = 0, n = arguments.length; i < n; ++i) {
                    this[i] = arguments[i];
                    ++this.length;
                }
            };
            var arr = new ArrayLike(undefined);

            assert.equal(JSRutils.Utils.isDict({}), true, '{} is not a dict');
            assert.equal(JSRutils.Utils.isDict([]), false, '[] is a dict');
            assert.equal(JSRutils.Utils.isDict(arr), false, 'array-like object is a dict');
            assert.equal(JSRutils.Utils.isDict(true), false, 'true is a dict');
            assert.equal(JSRutils.Utils.isDict(1), false, '1 is a dict');
            assert.equal(JSRutils.Utils.isDict(""), false, '"" is a dict');
            assert.equal(JSRutils.Utils.isDict(function () {}), false, 'function is a dict');
            assert.equal(JSRutils.Utils.isDict(null), false, 'null is a dict');
            assert.equal(JSRutils.Utils.isDict(undefined), false, 'undefined is a dict');
        });

        it('covers JSRutils.Utils.mergeObjects', function () {
            var dst = {
                a: 'apple',
                b: 'banana',
                nested: {
                    c: 'crow',
                    z: 'Zorro'
                }
            };
            var src = {
                c: 'crow',
                nested: {
                    empty: [],
                    a: 'arrow',
                    nested: {
                        'null': null
                    }
                }
            };
            var result = JSRutils.Utils.mergeObjects(dst, src);

            var expected = {
                a: 'apple',
                b: 'banana',
                c: 'crow',
                nested: {
                    a: 'arrow',
                    c: 'crow',
                    empty: [],
                    z: 'Zorro',
                    nested: {
                        'null': null
                    }
                }
            };
            assert.deepEqual(result, expected);
        });
    });
})();
