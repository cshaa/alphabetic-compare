# alphabetic-compare
Checks whether two strings are in alphabetical order, with support for natural sort and national quirks.

```typescript
import compare from 'alphabetic-compare';

['Alan 10', 'Bobby', 'Alan 2', 'Bob Smith'].sort((a,b) => compare(a, b, 'en'));
    // → [Alan2, Alan10, Bob Smith, Bobby]
```

## Features
 * Natural sorting of numbers
 * Multiword sorting
 * Internationalized sorting for different languages
 * Independent of Intl
 * Intl can be used as fallback
 * Custom sorting rules

*Keywords: Alphabetical order, alphabetization, lexicographical order, language-specific ordering conventions, collation, sorting, numeric order.*

## Basic usage
To compare strings in supported languages, you can use this method:
```typescript
function compare(a: string, b: string, lang: ISO_639_1): -1 | 0 | 1
```
If string `a` should be sorted above `b`, you get `-1`. If it sould be sorted below, you get `1`. `0` means the strings are alphabetically identical, but they might still differ in non-alphabetical symbols like the apostrophe.

## Advanced usage
If you want to customize the sorting algorithm, instead of language you can pass settings to the method:
```typescript
interface Configuration {
    language?: ISO_639_1,
    nullSorting?: -1 | 0 | 1,
    allowIntl?: 0 | 1 | 2,
    customSorting?: Sorting
}

function compare(a: string, b: string, conf: Configuration): -1 | 0 | 1
```

Null sorting lets you decide what happens with unknown symbols. With `-1` they will be sorted above everything else, with `1` they will be sorted below everything else and with `0` (default) they will be ignored.

Intl fallback can be controlled by `allowIntl`. Value `0` means it won't be ever used, `1` (default) means use Intl if there's no local rule for the language, `2` means use Intl whenever it's possible.

To find out how to define your own sorting, take a look at `test/basic.ts` and `src/lang.ts`. If pass the sorting as `customSorting`, the selected language will be ignored.

## Supported languages
 * English
 * Czech
 * Slovak
 * all languages made available by `Intl`
