import {
    Block,
    BlockMatch,
    Cluster,
    ClusterMatch,
    Comparison,
    Config,
    ISO_639_1,
    Letter,
    LetterMatch,
    PatternMatch,
    Sorting,
    SortingMatch
} from "./types";

import { lang } from './lang';

const defaultConfig: Config =
{
    language: 'en',
    nullSorting: 0,
    allowIntl: 1
}

export function compare(a: string, b: string, config: Partial<Config>): Comparison;
export function compare(a: string, b: string, language: string    ): Comparison;
export function compare(a: string, b: string, langOrConf: string | Partial<Config>): Comparison
{
    // Setup

    a = ''+a;
    b = ''+b;

    let config: Config;

    if (typeof langOrConf === 'string')
    {
        config = {...defaultConfig, language: langOrConf};
    }
    else
    {
        config = {...defaultConfig, ...langOrConf};
    }

    let sorting: Sorting;
    if (config.customSorting) sorting = config.customSorting;
    else sorting = lang[config.language as ISO_639_1];

    if ( !config.customSorting && Intl )
    if ( config.allowIntl === 2 || config.allowIntl === 1 && !sorting )
    {
        let locales = Intl.Collator.supportedLocalesOf(config.language);
        if (locales.length) return Intl.Collator(locales[0], {numeric: true}).compare(a, b) as Comparison;
    }

    if (!sorting) throw new TypeError(`Sorting preferences for language "${config.language}" not found.`);

    const NS = config.nullSorting;


    // Sorting

    const lenA = a.length;
    const lenB = b.length;
    let iA = 0;
    let iB = 0;

    groups:
    while (true) // can you feel the excitement?
    {
        // Looping through groups

        if (iA >= lenA)
        {
            if (iB >= lenB) return 0; // both strings are over and no difference found
            else return -1; // A is shorter
        }
        else if (iB >= lenB) return 1; // B is shorter


        const aa = a.substr(iA);
        const bb = b.substr(iB);

        const sMatchA = matchSorting(aa, sorting);
        const sMatchB = matchSorting(bb, sorting);

        if (!sMatchA)
        {
            if (!sMatchB) { iA++; iB++; continue; } // both are null
            else if (NS*NS === 1) return NS; // A is null and is sorted
            else { iA++; continue; } // A is null and is ignored
        }
        else if (!sMatchB)
        {
            if (NS*NS === 1) return -NS as Comparison; // B is null and is sorted
            else { iB++; continue; } // B is null and is ignored
        }

        if (sMatchA.block !== sMatchB.block) // blocks are different
        return sMatchA.block < sMatchB.block ? -1 : 1;


        // blocks are the same, time to compare letter clusters

        const block = sorting.blocks[sMatchA.block];
        let bMatchA = matchBlock(aa, block, true)!;
        let bMatchB = matchBlock(bb, block, true)!;

        const ltr = block.order === 'ltr' || block.order === 'numeric-ltr';
        const numeric = block.order === 'numeric-ltr' || block.order === 'numeric-rtl';


        // check the order of magnitude of numbers
        if (numeric)
        {

            let dsa = bMatchA.decimalSeparatorIndex;
            let dsb = bMatchB.decimalSeparatorIndex;

            if (dsa === null) dsa = ltr ? bMatchA.letters.length : -1;
            if (dsb === null) dsb = ltr ? bMatchB.letters.length : -1;

            if (!ltr) { dsa = -dsa; dsb = -dsb; }

            if (dsa > dsb) return 1; // A's decimal separator is further, ie. A is greater
            if (dsa < dsb) return -1; // B is greater than A
        }


        // this decides if all letter clusters are the same
        let maybeCompare: Comparison = 0;


        let lettersA: ClusterMatch[] | null = null;
        let lettersB: ClusterMatch[] | null = null;

        clusters:
        while (true) // like riding a motorcycle on a roof of a train
        {
            // Looping through letters in the group

            if (!lettersA)
            {
                lettersA = Array.from(bMatchA.letters);
                if (!ltr) lettersA.reverse();
            }

            if (!lettersB)
            {
                lettersB = Array.from(bMatchB.letters);
                if (!ltr) lettersB.reverse();
            }

            const clusterA = lettersA[0].cluster;
            const clusterB = lettersB[0].cluster;

            if (clusterA > clusterB) return 1; // A is greater
            if (clusterA < clusterB) return -1; // B is greater

            if (maybeCompare === 0) // if A and B are identical so far
            {
                const letterA = lettersA[0].letter;
                const letterB = lettersB[0].letter;

                if (letterA > letterB) maybeCompare = 1; // A might be greater
                if (letterA < letterB) maybeCompare = -1; // B might be greater
            }

            if (lettersA.length > 1 && lettersB.length > 1)
            {
                lettersA.shift();
                lettersB.shift();
            }
            else
            {
                lettersA = lettersB = null;

                iA += bMatchA.length;
                iB += bMatchB.length;

                if (bMatchA.incomplete && bMatchB.incomplete)
                {
                    bMatchA = matchBlock(a.substr(iA), block, true)!;
                    bMatchB = matchBlock(b.substr(iB), block, true)!;

                    if (!bMatchA || !bMatchB) break clusters;
                }
                else
                {
                    break clusters;
                }
            }
        }
        // end of clusters


        if (maybeCompare * maybeCompare) return maybeCompare;

    }
    // end of groups
}




export function matchPattern(str: string, pattern: Letter): PatternMatch | null
{
    if (typeof pattern === 'string')
    {
        let result = str.substr(0, pattern.length) === pattern;
        if (result) return { length: pattern.length };
    }
    else
    {
        let match = str.match(pattern);

        if (match && match.index !== 0)
        {
            // @ts-ignore
            if (console) console.error('Invalid RegExp', pattern, str);

            throw Error(
                "Internal error: the regular expression used to match " +
                "letters matched a letter that was not at the beginning of the string."
            );
        }

        if (match) return { length: match[0].length };
    }

    return null;
}

export function matchLetter(str: string, patterns: Cluster): LetterMatch | null
{
    if (!Array.isArray(patterns)) patterns = [patterns] as [string]|[RegExp];

    for (let i = 0; i < patterns.length; i++)
    {
        const p = patterns[i];
        const match = matchPattern(str, p);
        if (match) return { ...match, letter: i };
    }

    return null;
}

export function matchBlock(str: string, block: Block, whole: boolean): BlockMatch | null
{
    validateOrder(block.order);

    if (block.order === 'custom')
    return block.matchBlock(str);

    let letters: ClusterMatch[] = [];
    let incomplete = true;
    let decimalSeparatorIndex: number | null = null;

    let i = 0;

    top:
    while (true) // this is gonna hurt my pee pee
    {
        if (i >= str.length)
        {
            incomplete = false;
            break top;
        }

        let substr = str.substr(i);

        if (block.separator)
        {
            const match = matchLetter(substr, block.separator);
            if (match)
            {
                incomplete = false;
                break top;
            }
        }

        if ( (!whole || block.order === 'ltr') && letters.length >= 1)
        {
            break top;
        }

        if (block.ignore)
        {
            const match = matchLetter(substr, block.ignore);
            if (match)
            {
                i += match.length;
                continue top;
            }
        }

        if (block.order === 'numeric-ltr' || block.order  === 'numeric-rtl')
        {
            if (decimalSeparatorIndex === null && block.decimalSeparator)
            {
                const match = matchLetter(substr, block.decimalSeparator);
                if (match)
                {
                    decimalSeparatorIndex = letters.length - 1;
                    i += match.length;
                    continue top;
                }
            }
        }

        for (let c = 0; c < block.letters.length; c++)
        {
            const cluster = block.letters[c];
            const match = matchLetter(substr, cluster);

            if (match)
            {
                letters.push({ ...match, cluster: c });
                i += match.length;
                continue top;
            }
        }

        break top;
    }

    if (letters.length === 0) return null;
    return { letters, incomplete, decimalSeparatorIndex, length: i };
}

export function matchSorting(str: string, sorting: Sorting): SortingMatch | null
{
    for (let i = 0; i < sorting.blocks.length; i++)
    {
        const block = sorting.blocks[i];
        const match = matchBlock(str, block, false);
        if (match) return { ...match, block: i };
    }

    return null;
}


function validateOrder(order: Block["order"]): void
{
    if (order === 'ltr') return;
    if (order === 'rtl') return;
    if (order === 'numeric-ltr') return;
    if (order === 'numeric-rtl') return;
    if (order === 'custom') return;

    throw new TypeError("Unsupported value for block.order: " + order);
}