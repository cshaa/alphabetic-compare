declare type ISO_639_1 = 'en' | 'cs' | 'sk';
interface Config {
    nullSorting: Comparison;
    language: string;
    customSorting?: Sorting;
    allowIntl: 0 | 1 | 2;
}
declare type Comparison = -1 | 0 | 1;
declare type Letter = string | RegExp;
declare type Cluster = Letter | readonly Letter[];
declare type List = readonly Cluster[];
interface CommonBlock {
    letters: List;
    separator?: Cluster;
    ignore?: Cluster;
}
interface NonNumericBlock extends CommonBlock {
    order: 'ltr' | 'rtl';
}
interface NumericBlock extends CommonBlock {
    order: 'numeric-ltr' | 'numeric-rtl';
    decimalSeparator?: Cluster;
}
interface CustomBlock {
    order: 'custom';
    matchBlock: (str: string) => BlockMatch;
    compareBlocks: (str1: string, str2: string) => -1 | 0 | 1;
}
declare type _Block = NonNumericBlock | NumericBlock | CustomBlock;
interface Sorting<T extends readonly _Block[] = readonly _Block[]> {
    blocks: T;
}
interface PatternMatch {
    length: number;
}
interface LetterMatch extends PatternMatch {
    letter: number;
}
interface ClusterMatch extends LetterMatch {
    cluster: number;
}
interface BlockMatch {
    incomplete: boolean;
    length: number;
    letters: ReadonlyArray<ClusterMatch>;
    decimalSeparatorIndex: number | null;
}
interface SortingMatch extends BlockMatch {
    block: number;
}
//# sourceMappingURL=types.d.ts.map