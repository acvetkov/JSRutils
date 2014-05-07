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
    describe('JSRutils.Numeral test', function () {
        it('covers JSRutils.Numeral.choosePlural', function () {
            var numeral = JSRutils.Numeral,
                numbers = [-1, 1, 0, 2, -2, 3, 4, 5, 10, 11, 100, 101, 104, 109],
                nails = ['гвоздь', 'гвоздь', 'гвоздей', 'гвоздя', 'гвоздя', 'гвоздя', 'гвоздя', 'гвоздей', 'гвоздей', 'гвоздей', 'гвоздей', 'гвоздь', 'гвоздя', 'гвоздей'],
                plural;
            for (var i = 0, max = numbers.length; i < max; i++) {
                var number = numbers[i],
                    nail = nails[i];
                if (typeof number !== 'undefined' && typeof nail !== 'undefined') {
                    plural = numeral.choosePlural(number, ['гвоздь', 'гвоздя', 'гвоздей']);
                    assert.equal(plural, nail);
                }
            }
        });
        it('covers JSRutils.Numeral.getPlural', function () {
            var numeral = JSRutils.Numeral,
                numbers = [-1, 2, 11, 1104, 1111],
                variants = ['гвоздь', 'гвоздя', 'гвоздей'],
                nails = ['-1 гвоздь', '2 гвоздя', '11 гвоздей', '1 104 гвоздя', '1 111 гвоздей'],
                absence = 'нет гвоздей',
                plural;

            for (var i = 0, max = numbers.length; i < max; i++) {
                var number = numbers[i],
                    nail = nails[i];
                if (typeof number !== 'undefined' && typeof nail !== 'undefined') {
                    plural = numeral.getPlural(number, variants);
                    assert.equal(plural, nail);
                }
            }
            assert.equal(absence, numeral.getPlural(0, variants, absence));
        });
        it('covers JSRutils.Numeral.sumString male variant', function () {
            var numbers = [0, 1, 2, 10, 12, 31, 104, 1000000, 1102003, 1100000001],
                variants = ['гвоздь', 'гвоздя', 'гвоздей'],
                nails = ['ноль гвоздей', 'один гвоздь', 'два гвоздя', 'десять гвоздей', 'двенадцать гвоздей', 'тридцать один гвоздь', 'сто четыре гвоздя', 'один миллион гвоздей', 'один миллион сто две тысячи три гвоздя', 'один миллиард сто миллионов один гвоздь'],
                numeral = JSRutils.Numeral,
                expect,
                sumString;
            for (var i = 0, max = numbers.length; i < max; i++) {
                if (typeof nails[i] !== 'undefined') {
                    expect = nails[i];
                    sumString = numeral.sumString(numbers[i], JSRutils.Male, variants);
                    assert.equal(expect, sumString);
                }
            }
        });

        it('covers JSRutils.Numeral.sumString female variant', function () {
            var numbers = [0, 1, 2, 10, 12, 31, 104, 1000000, 1102003, 1100000001],
                variants = ['шляпка', 'шляпки', 'шляпок'],
                nails = ['ноль шляпок', 'одна шляпка', 'две шляпки', 'десять шляпок', 'двенадцать шляпок', 'тридцать одна шляпка', 'сто четыре шляпки', 'один миллион шляпок', 'один миллион сто две тысячи три шляпки', 'один миллиард сто миллионов одна шляпка'],
                numeral = JSRutils.Numeral,
                expect,
                sumString;
            for (var i = 0, max = numbers.length; i < max; i++) {
                if (typeof nails[i] !== 'undefined') {
                    expect = nails[i];
                    sumString = numeral.sumString(numbers[i], JSRutils.Female, variants);
                    assert.equal(expect, sumString);
                }
            }
        });

        it('covers JSRutils.Numeral.getInWords', function () {
            var numeral = JSRutils.Numeral;
            assert.equal('сто два', numeral.getInWords(102));
            assert.equal('сто две тысячи', numeral.getInWordsInt(102000));
            assert.equal('сто две тысячи одна', numeral.getInWords(102001, JSRutils.Female));

            var floats = [0.2, 10.0, 10.1, 2.25, 0.01, 0.1, 0.000000001],
                strings = ['ноль целых две десятых', 'десять целых ноль десятых', 'десять целых одна десятая', 'две целых двадцать пять сотых', 'ноль целых одна сотая', 'ноль целых одна десятая', 'ноль целых одна миллиардная'];
            for (var i = 0, max = floats.length; i < max; i++) {
                var expect = numeral.getInWordsFloat(floats[i]);
                if (typeof strings[i] !== 'undefined') {
                    assert.equal(expect, strings[i]);
                }
            }
        });

        it('covers JSRutils.Numeral.getRubles', function () {
            var rubles = [102, 1000, 0.2, 2.25, 0.01],
                strings = ['сто два рубля', 'одна тысяча рублей', 'двадцать копеек', 'два рубля двадцать пять копеек', 'одна копейка'],
                numeral = JSRutils.Numeral;
            for (var i = 0, max = strings.length; i < max; i++) {
                var expect = strings[i],
                    result = numeral.getRubles(rubles[i]);
                assert.equal(expect, result);
            }
        });
    });
})();
