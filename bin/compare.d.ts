export declare function compare(a: string, b: string, config: Partial<Config>): Comparison;
export declare function compare(a: string, b: string, language: string): Comparison;
export declare function matchPattern(str: string, pattern: Letter): PatternMatch | null;
export declare function matchLetter(str: string, patterns: Cluster): LetterMatch | null;
export declare function matchBlock(str: string, block: _Block, whole: boolean): BlockMatch | null;
export declare function matchSorting(str: string, sorting: Sorting): SortingMatch | null;
//# sourceMappingURL=compare.d.ts.map