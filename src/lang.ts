

// English

const en =
{
    blocks: [
        <NumericBlock>
        {
            // Numbers
            order: 'numeric-ltr',
            letters: [...'0123456789'],
            decimalSeparator: /^\.(?=\d)/
        },

        <NonNumericBlock>
        {
            // Letters
            order: 'ltr',
            letters: Array.from('abcdefghijklmnopqrstuvwxyz').map( l => RegExp('^' + l, 'i') )
        }
    ]
};



// Czech

const cs =
{
    blocks: [
        <NumericBlock>
        {
            ...en.blocks[0],
            decimalSeparator: /^,(?=\d)/
        },

        <NonNumericBlock>
        {
            ...en.blocks[1],
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



export const lang: { [code in ISO_639_1]: Sorting } = { en, cs };