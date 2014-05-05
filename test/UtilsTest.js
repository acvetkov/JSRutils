/*global describe, it, JSRutils*/
"use strict";
var fs = require('fs');
var vm = require('vm');
var path = './build/JSRutils.min.js';

var code = fs.readFileSync(path);
vm.runInThisContext(code);
var assert = require("assert");

describe('JSRutils.Utils test', function () {
    it('covers JSRutils.Utils.trim', function () {
        assert.equal(JSRutils.Utils.trim("\r \n \r\n 123 \r\n "), "123");
    });
});
