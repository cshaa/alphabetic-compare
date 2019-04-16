/// <reference path="./types.ts" />

// English

const en: Sorting<[NonNumericBlock, NumericBlock, NonNumericBlock]> =
{
    blocks: [
        {
            // Space
            order: 'ltr',
            letters: [/^\s+/]
        },
        {
            // Numbers
            order: 'numeric-ltr',
            letters: [...'0123456789'],
            decimalSeparator: /^\.(?=\d)/,
            ignore: ','
        },

        {
            // Letters
            order: 'ltr',
            letters: Array.from('abcdefghijklmnopqrstuvwxyz').map( l => RegExp('^' + l, 'i') )
        }
    ]
};



// Czech

const cs: typeof en =
{
    blocks: [
        {
            ...en.blocks[0]
        },
        {
            ...en.blocks[1],
            decimalSeparator: /^,(?=\d)/,
            ignore: /^\s+/
        },

        {
            ...en.blocks[2],
            letters:
            [
                [/^a/i, /^á/i],
                [/^b/i],
                [/^c(?!h)/i, /^č/i],
                [/^d/i, /^ď/i],
                [/^e/i, /^é/i, /^ě/i],
                [/^f/i],
                [/^g/i],
                [/^h/i],
                [/^ch/i],
                [/^i/i, /^í/i],
                [/^j/i],
                [/^k/i],
                [/^l/i],
                [/^m/i],
                [/^n/i, /^ň/i],
                [/^o/i, /^ó/i],
                [/^p/i],
                [/^q/i],
                [/^r/i, /^ř/i],
                [/^s/i, /^š/i],
                [/^t/i, /^ť/i],
                [/^u/i, /^ú/i, /^ů/i],
                [/^v/i],
                [/^w/i],
                [/^x/i],
                [/^y/i, /^ý/i],
                [/^z/i, /^ž/i]
            ]
        }
    ]
}



// Slovak

const sk: typeof cs =
{
    blocks: [
        cs.blocks[0], // spaces
        cs.blocks[1], // numbers
        {
            // letters
            ...cs.blocks[2],
            letters: [
                [/^a/i, /^á/i, /^ä/i],
                [/^b/i],
                [/^c(?!h)/i, /^č/i],
                [/^d(?![zž])/i, /^ď/i],
                [/^dz/i, /^dž/i],
                [/^e/i, /^é/i],
                [/^f/i],
                [/^g/i],
                [/^h/i],
                [/^ch/i],
                [/^i/i, /^í/i],
                [/^j/i],
                [/^k/i],
                [/^l/i, /^ĺ/i, /^ľ/i],
                [/^m/i],
                [/^n/i, /^ň/i],
                [/^o/i, /^ó/i, /^ô/i],
                [/^p/i],
                [/^q/i],
                [/^r/i, /^ŕ/i],
                [/^s/i, /^š/i],
                [/^t/i, /^ť/i],
                [/^u/i, /^ú/i],
                [/^v/i],
                [/^w/i],
                [/^x/i],
                [/^y/i, /^ý/i],
                [/^z/i, /^ž/i],
            ]
        }
    ]
}


export const lang: { [code in ISO_639_1]: Sorting } = { en, cs, sk };