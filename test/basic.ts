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

describe('the algorithm', () =>
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


    it('matches sortings', () =>
    {
        const sorting: Sorting = {
            blocks: [
                {
                    order: 'ltr',
                    letters: ['a', 'b']
                },
                {
                    order: 'numeric-ltr',
                    letters: ['b', 'c'],
                    decimalSeparator: '.'
                }
            ]
        };

        expect( matchSorting('dabc', sorting) ).equals( null );

        expect( matchSorting('abc', sorting) ).deep.equals(<SortingMatch>{
            incomplete: true,
            length: 1,
            block: 0,
            decimalSeparatorIndex: null,
            letters: [
                { cluster: 0, letter: 0, length: 1 }
            ]
        });

        expect( matchSorting('bca', sorting) ).deep.equals(<SortingMatch>{
            incomplete: true,
            length: 1,
            block: 0,
            decimalSeparatorIndex: null,
            letters: [
                { cluster: 1, letter: 0, length: 1 }
            ]
        });

        expect( matchSorting('cba', sorting) ).deep.equals(<SortingMatch>{
            incomplete: true,
            length: 1,
            block: 1,
            decimalSeparatorIndex: null,
            letters: [
                { cluster: 1, letter: 0, length: 1 }
            ]
        });

        expect( matchSorting('.b', sorting) ).deep.equals(<SortingMatch>{
            incomplete: false,
            length: 2,
            block: 1,
            decimalSeparatorIndex: -1,
            letters: [
                { cluster: 0, letter: 0, length: 1 }
            ]
        });



        const sorting2: Sorting<NonNumericBlock[]> = {
            blocks: [
                {
                    order: 'ltr',
                    letters: [...'abc']
                },
                {
                    order: 'ltr',
                    letters: [...'xyz']
                }
            ]
        };

        expect( matchSorting('c', sorting2)!.block ).equals(0);
    });


    it('compares ltr text', () =>
    {
        const sorting: Sorting<NonNumericBlock[]> = {
            blocks: [
                {
                    order: 'ltr',
                    letters: [...'abc', ['d','đ']]
                },
                {
                    order: 'ltr',
                    letters: [...'123']
                }
            ]
        };

        const config: Partial<Config> = {
            customSorting: sorting
        };

        expect( compare('c', '1', config) ).equals(-1);
        expect( compare('1', 'c', config) ).equals( 1);
        expect( compare('1', '1', config) ).equals( 0);

        expect( compare('a', 'b', config) ).equals(-1);
        expect( compare('b', 'a', config) ).equals( 1);
        expect( compare('a', 'a', config) ).equals( 0);

        expect( compare('d', 'đ', config) ).equals(-1);
        expect( compare('đ', 'd', config) ).equals( 1);
        expect( compare('d', 'd', config) ).equals( 0);

        expect( compare('aba', 'a1a', config) ).equals(-1);
        expect( compare('a1a', 'aba', config) ).equals( 1);
        expect( compare('a1a', 'a1a', config) ).equals( 0);

        expect( compare('aba', 'aca', config) ).equals(-1);
        expect( compare('aca', 'aba', config) ).equals( 1);
        expect( compare('aba', 'aba', config) ).equals( 0);

        expect( compare('ada', 'ađa', config) ).equals(-1);
        expect( compare('ađa', 'ada', config) ).equals( 1);
        expect( compare('ada', 'ada', config) ).equals( 0);

        expect( compare('ađa', 'adb', config) ).equals(-1);
        expect( compare('adb', 'ađa', config) ).equals( 1);

        expect( compare('ađ1', 'ad2', config) ).equals( 1);
        expect( compare('ad2', 'ađ1', config) ).equals(-1);
    });


    it('compares ltr numbers', () =>
    {
        const sorting: Sorting<[NumericBlock, NonNumericBlock]> = {
            blocks: [
                {
                    order: 'numeric-ltr',
                    letters: [...'0123'],
                    decimalSeparator: '.',
                    ignore: ','
                },
                {
                    order: 'ltr',
                    letters: ['a']
                }
            ]
        };

        const config: Partial<Config> = {
            customSorting: sorting
        };

        expect( compare('1', 'a', config) ).equals(-1);
        expect( compare('a', '1', config) ).equals( 1);
        expect( compare('1', '1', config) ).equals( 0);

        expect( compare('1', '2', config) ).equals(-1);
        expect( compare('2', '1', config) ).equals( 1);

        expect( compare('2', '10', config) ).equals(-1);
        expect( compare('10', '2', config) ).equals( 1);


        expect( compare('122', '123', config) ).equals(-1);
        expect( compare('123', '122', config) ).equals( 1);


        expect( compare('2.', '10',   config) ).equals(-1);
        expect( compare('10', '2.',   config) ).equals( 1);
        expect( compare('2.1', '10',  config) ).equals(-1);
        expect( compare('10', '2.1',  config) ).equals( 1);
        expect( compare('2.12', '10', config) ).equals(-1);
        expect( compare('10', '2.12', config) ).equals( 1);


        expect( compare('2000.000000', '1,233,011.123', config) ).equals(-1);
        expect( compare('1,233,011.123', '2000.000000', config) ).equals( 1);


    });

});
