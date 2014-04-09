JSRUtils
----------

JSRutils is a Russian-specific string utils (transliteration, numeral is words, russian dates, typography) for Javascript.
This is a port of the PHP [RUtils](https://github.com/Andre-487/php_rutils) to Javascript.


----------

JSRutils — утилиты для работы c текстом на русском языке (транслитерация, числительные словами, русские даты,
простая типографика) для языка Javascript.
JSRutils — порт утилит [RUtils](https://github.com/Andre-487/php_rutils) на Javascript.

Basic usage
-----------

**Numeral Module**

Choosing the word form depending of a number:
```js
var Numeral = JSRutils.Numeral,
    variants = ['гвоздь', 'гвоздя', 'гвоздей'];

Numeral.choosePlural(15, variants);
//Result: гвоздей

Numeral.getPlural(2, variants);
//Result: 2 гвоздя
```

Choosing the word form and print number in words:
```js

Numeral.sumString(1234, JSRUtils.Male, variants);
//Result: одна тысяча двести тридцать четыре гвоздя

var femaleItems = ['шляпка', 'шляпки', 'шляпок'];
Numeral.sumString(1231, JSRUtils.Female, femaleItems);
//Result: одна тысяча двести тридцать одна шляпка
```

Print number in words:
```js
var Numeral = JSRutils.Numeral;

Numeral.getInWordsInt(100);
//Result: сто

Numeral.getInWordsFloat(100.025);
//Result: сто целых двадцать пять тысячных

Numeral.getInWords(100.0);
//Result: сто
```

Print money (RUB):
```js
Numeral.getRubles(100.25);
//Result: сто рублей двадцать пять копеек
```