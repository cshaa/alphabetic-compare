export declare type ISO_639_1 = 'en' | 'cs' | 'sk';
export interface Config {
    nullSorting: Comparison;
    language: string;
    customSorting?: Sorting;
    allowIntl: 0 | 1 | 2;
}
export declare type Comparison = -1 | 0 | 1;
export declare type Letter = string | RegExp;
export declare type Cluster = Letter | readonly Letter[];
export declare type List = readonly Cluster[];
export interface CommonBlock {
    letters: List;
    separator?: Cluster;
    ignore?: Cluster;
}
export interface NonNumericBlock extends CommonBlock {
    order: 'ltr' | 'rtl';
}
export interface NumericBlock extends CommonBlock {
    order: 'numeric-ltr' | 'numeric-rtl';
    decimalSeparator?: Cluster;
}
export interface CustomBlock {
    order: 'custom';
    matchBlock: (str: string) => BlockMatch;
    compareBlocks: (str1: string, str2: string) => -1 | 0 | 1;
}
export declare type Block = NonNumericBlock | NumericBlock | CustomBlock;
export interface Sorting<T extends readonly Block[] = readonly Block[]> {
    blocks: T;
}
export interface PatternMatch {
    length: number;
}
export interface LetterMatch extends PatternMatch {
    letter: number;
}
export interface ClusterMatch extends LetterMatch {
    cluster: number;
}
export interface BlockMatch {
    incomplete: boolean;
    length: number;
    letters: ReadonlyArray<ClusterMatch>;
    decimalSeparatorIndex: number | null;
}
export interface SortingMatch extends BlockMatch {
    block: number;
}
//# sourceMappingURL=types.d.ts.map