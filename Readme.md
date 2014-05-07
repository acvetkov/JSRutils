JSRUtils
----------

JSRutils is a Russian-specific string utils (transliteration, numeral is words, russian dates, typography) for Javascript.
This is a port of the PHP [RUtils](https://github.com/Andre-487/php_rutils) to Javascript.


----------

JSRutils — утилиты для работы c текстом на русском языке для языка Javascript.
JSRutils — порт утилит [RUtils](https://github.com/Andre-487/php_rutils) на Javascript.

Supported platforms
----------
The library was tested on this platforms: Node.js 0.10+, IE 9+, Chrome 7+, FireFox 4+, Opera 20+

Basic usage
-----------
Modules of PHP RUtils:
 - Numeral - Plural forms and in-word representation for numerals
 - Dt - Russian dates without locales

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

**Dt Module**
Today date:
```js
var params = {
    date: null,
    format: 'сегодня %d %F %Y года',
    monthInflected: true
};
var result = JSRutils.Dt.ruStrFTime(params);
console.log(result);
// Result: сегодня 7 мая 2014 года
```

Historical date:
```js
var params = {
    date: '1945-05-09T12:00:00',
    format: '%l %d %F %Y была одержана победа над немецко-фашистскими захватчиками',
    monthInflected: true,
    preposition: true
};
var result = JSRutils.Dt.ruStrFTime(params);
console.log(result);
// Result: в среду 9 мая 1945 была одержана победа над немецко-фашистскими захватчиками
```
