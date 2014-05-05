/*global describe, it, JSRutils*/
'use strict';
var fs = require('fs');
var vm = require('vm');
var path = './build/JSRutils.min.js';

var code = fs.readFileSync(path);
vm.runInThisContext(code);
var assert = require('assert');

describe('JSRutils.Utils test', function () {
    it('covers JSRutils.Utils.trim', function () {
        assert.equal(JSRutils.Utils.trim('\r \n \r\n 123 \r\n '), '123');
    });

    it('covers JSRutils.Utils.arrayFilter correct result', function () {
        var testArr = [];
        for (var i=1; i<=10; ++i) {
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
        var actualThisArg = {};
        JSRutils.Utils.arrayFilter([1, 2, 3], function () {
            actualThisArg = this;
            return false;
        }, expectedThisArg);
        assert.strictEqual(expectedThisArg, actualThisArg);
    });
});
