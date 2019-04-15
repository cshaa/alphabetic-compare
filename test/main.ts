/// <reference path="../src/types.ts" />

import { describe, it } from 'mocha';
import { expect } from 'chai';

import
{
    matchPattern,
    matchLetter,
    matchBlock,
    matchSorting,
    compare
}
from '../src/compare';

describe('the sorter', () =>
{
    it('matches patterns', () =>
    {
        expect( matchPattern('abc', 'b')   ).equals( null );
        expect( matchPattern('abc', 'a')   ).deep.equals({ length: 1 });
        expect( matchPattern('abc', 'ab')  ).deep.equals({ length: 2 });
        expect( matchPattern('abc', /^b/)  ).equals( null );
        expect( matchPattern('abc', /^a/)  ).deep.equals({ length: 1 });
        expect( matchPattern('abc', /^ab/) ).deep.equals({ length: 2 });

        expect( () => matchPattern('abc', /b/) ).throws;
    });


    it('matches letters', () =>
    {
        const letters = ['a', 'bc', /^d/];

        expect( matchLetter('cba', letters) ).equals( null );
        expect( matchLetter('abc', letters) ).deep.equals({ letter: 0, length: 1 });
        expect( matchLetter('bca', letters) ).deep.equals({ letter: 1, length: 2 });
        expect( matchLetter('dab', letters) ).deep.equals({ letter: 2, length: 1 });
    });


    it('matches non-numeric ltr blocks', () =>
    {
        const block: NonNumericBlock = {
            order: 'ltr',
            letters: [ 'ab', ['b', 'c']],
            ignore: 'X',
            separator: '!'
        };


        // whole = false

        expect( matchBlock('efghi', block, false) ).equals( null );
        expect( matchBlock('!abcd', block, false) ).equals( null );

        expect( matchBlock('abcde', block, false) ).deep.equals(<BlockMatch>{
            length: 2,
            incomplete: true,
            letters: [{ cluster: 0, letter: 0, length: 2}],
            decimalSeparatorIndex: null,
        });

        expect( matchBlock('cdefg', block, false) ).deep.equals(<BlockMatch>{
            length: 1,
            incomplete: true,
            letters: [{ cluster: 1, letter: 1, length: 1 }],
            decimalSeparatorIndex: null
        });

        expect( matchBlock('b', block, false) ).deep.equals(<BlockMatch>{
            length: 1,
            incomplete: false,
            letters: [{ cluster: 1, letter: 0, length: 1 }],
            decimalSeparatorIndex: null
        });

        expect( matchBlock('XX', block, false) ).equals( null );

        expect( matchBlock('Xc', block, false) ).deep.equals(<BlockMatch>{
            length: 2,
            incomplete: false,
            letters: [{ cluster: 1, letter: 1, length: 1 }],
            decimalSeparatorIndex: null
        });

        expect( matchBlock('Xc!', block, false) ).deep.equals(<BlockMatch>{
            length: 2,
            incomplete: false,
            letters: [{ cluster: 1, letter: 1, length: 1 }],
            decimalSeparatorIndex: null
        });


        // whole = true

        expect( matchBlock('dabce', block, true) ).equals( null );

        expect( matchBlock('abcde', block, true) ).deep.equals(<BlockMatch>{
            length: 2,
            incomplete: true,
            letters: [{ cluster: 0, letter: 0, length: 2 }],
            decimalSeparatorIndex: null
        });
    });


    it('matches numeric ltr blocks', () =>
    {
        const block: NumericBlock = {
            order: 'numeric-ltr',
            letters: [ '0', '1', 'two' ],
            ignore: 'X',
            separator: '!',
            decimalSeparator: '.'
        };


        // whole = false

        expect( matchBlock('tabc', block, false) ).equals( null );
        expect( matchBlock('!100', block, false) ).equals( null );

        expect( matchBlock('Xtwo01', block, false) ).deep.equals(<BlockMatch>{
            length: 4,
            incomplete: true,
            letters: [{ cluster: 2, letter: 0, length: 3}],
            decimalSeparatorIndex: null,
        });

        expect( matchBlock('.1', block, false) ).deep.equals(<BlockMatch>{
            length: 2,
            incomplete: false,
            letters: [{ cluster: 1, letter: 0, length: 1 }],
            decimalSeparatorIndex: -1
        });



        // whole = true

        expect( matchBlock('t1wo0', block, true) ).equals( null );

        expect( matchBlock('two1X!', block, true) ).deep.equals(<BlockMatch>{
            length: 5,
            incomplete: false,
            decimalSeparatorIndex: null,
            letters: [
                { cluster: 2, letter: 0, length: 3 },
                { cluster: 1, letter: 0, length: 1 }
            ]
        });

        expect( matchBlock('0two1', block, true) ).deep.equals(<BlockMatch>{
            length: 5,
            incomplete: false,
            decimalSeparatorIndex: null,
            letters: [
                { cluster: 0, letter: 0, length: 1 },
                { cluster: 2, letter: 0, length: 3 },
                { cluster: 1, letter: 0, length: 1 }
            ]
        });

        expect( matchBlock('.01', block, true) ).deep.equals(<BlockMatch>{
            length: 3,
            incomplete: false,
            decimalSeparatorIndex: -1,
            letters: [
                { cluster: 0, letter: 0, length: 1 },
                { cluster: 1, letter: 0, length: 1 }
            ]
        });

        expect( matchBlock('two.1', block, true) ).deep.equals(<BlockMatch>{
            length: 5,
            incomplete: false,
            decimalSeparatorIndex: 0,
            letters: [
                { cluster: 2, letter: 0, length: 3 },
                { cluster: 1, letter: 0, length: 1 }
            ]
        })

    });


    it('sorts english', () =>
    {
        expect(compare('a', 'b', 'en')).equals(-1);
    });
});
