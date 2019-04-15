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


let lang: string;

function expectSorted(msg: string, arr: string[])
{
    for (let i = 0; i < arr.length - 1; i++)
    for (let j = i + 1; j < arr.length; j++)
    expect( compare(arr[i], arr[j], lang), msg ).equals(-1, `Values: ${arr[i]}, ${arr[j]}`);

}

describe('the locale config', () =>
{

    it('sorts english', () =>
    {
        lang = 'en';

        expectSorted('basic sorting', [
            'As', 'aster', 'aStrolabe', 'Astronomy', 'Astrophysics',
            'at', 'Ataman', 'Attack', 'Baa', 'Barnacle', 'Be', 'Been',
            'Benefit', 'Bent'
        ]);

        expectSorted('multiword sorting', [
            'Oak', 'Oak Hill', 'Oak Ridge', 'Oakley Park', 'Oakley River'
        ]);

        expectSorted('natural sorting', [
            'Photo 1', 'Photo 12', 'Photo 20', 'Photo 132', 'Video 1'
        ]);

        expectSorted('more numbers', [
            '0.1250 ha', '3 ha', '250 ha', '1000 ha', '1,250 ha'
        ]);
    });


    it('sorts czech', () =>
    {
        lang = 'cs';

        expectSorted('basic sorting', [
            'A', 'b'
        ]);

        expectSorted('diacritics', [
            'baa', 'baá', 'báa', 'bab', 'báb', 'bac', 'bač', 'bác', 'báč'
        ]);
    });

});