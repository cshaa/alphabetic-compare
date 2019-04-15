
type ISO_639_1 = 'en' | 'cs';

interface Config
{
    /**
     * Should nulls (ie. letters that have no defined sorting) be sorted
     * above all entries (1), bellow all entries (-1), or ignored (0)?
     */
    nullSorting: 0,

    /**
     * The ISO 639-1 code of the language that should be used for sorting.
     * Note that not all languages are supported. If you want to do custom
     * sorting, use the `customSorting` option.
     */
    language: ISO_639_1,

    /**
     * Markup description of your own sorting. To understand how it works,
     * see the descriptions of the individual types. If you implement a
     * functioning sorter for a new language, consider making a PR on the
     * project's repository: https://github.com/m93a/alphabetic-compare
     */
    customSorting?: Sorting
}



type Comparison = -1 | 0 | 1;

type Letter = string | RegExp;
type Cluster = Letter | Letter[];
type List = Cluster[];

interface CommonBlock
{
    letters: List;

    /** Character that marks end of the block. Eg. a space marks the end of a word. */
    separator?: Cluster;
    ignore?: Cluster;
}

interface NonNumericBlock
extends CommonBlock
{
    order: 'ltr' | 'rtl';
}

interface NumericBlock
extends CommonBlock
{
    order: 'numeric-ltr' | 'numeric-rtl';
    decimalSeparator?: Cluster;
}

interface CustomBlock
{
    order: 'custom';
    matchBlock: (str: string) => BlockMatch;
    compareBlocks: (str1: string, str2: string) => -1 | 0 | 1;
}

type Block = NonNumericBlock | NumericBlock | CustomBlock;

interface Sorting
{
    blocks: Block[];
}



interface PatternMatch
{
    length: number;
}

interface LetterMatch
extends PatternMatch
{
    letter: number;
}

interface ClusterMatch
extends LetterMatch
{
    cluster: number;
}


interface BlockMatch
{
    incomplete: boolean;

    /** String length of the block. For multichar letters, it's different from letters.length. */
    length: number;

    /** Array of matched letters, excluding ignored chars and (decimal) separators. */
    letters: ReadonlyArray<ClusterMatch>;

    /** The index in `this.letters` of the letter that precedes the decimal separator. */
    decimalSeparatorIndex: number | null;
}

interface SortingMatch
extends BlockMatch
{
    block: number;
}