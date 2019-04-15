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
 * Custom sorting rules

*Keywords: Alphabetical order, alphabetization, lexicographical order, language-specific ordering conventions, collation, sorting, numeric order.*

## Basic usage
To compare strings in supported languages, you can use this method:
```typescript
function compare(a: string, b: string, lang: ISO_639_1): -1 | 0 | 1
```
If string `a` should be sorted above `b`, you get `-1`. If it sould be sorted under, you get `1`. `0` means the strings are alphabetically identical, but they might still differ in non-alphabetical symbols like the apostrophe.

## Advanced usage
If you want to customize the sorting algorithm, instead of language you can pass settings to the method:
```typescript
interface Configuration {
    language?: ISO_639_1,
    nullSorting?: -1 | 0 | 1,
    customSorting?: Sorting
}

function compare(a: string, b: string, conf: Configuration): -1 | 0 | 1
```

Null sorting lets you decide what happens with unknown symbols. With `-1` they will be sorted above everything else, with `1` they will be sorted under everything else and with `0` they will be ignored.

To find out how to define your own sorting, take a look at `test/basic.ts` and `src/lang.ts`. If pass the sorting as `customSorting`, the selected language will be ignored.

## Supported languages
 * English
 * Czech
 * Slovak