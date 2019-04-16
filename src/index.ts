import { Config, Block, NonNumericBlock, NumericBlock, CustomBlock, Cluster } from "./types";

import { compare } from './compare';
export default compare;

export type Configuration = Config;
export { Block };
export namespace Block
{
    export type NonNumeric = NonNumericBlock;
    export type Numeric = NumericBlock;
    export type Custom = CustomBlock;
}

export type AlphabetEntry = Cluster;
