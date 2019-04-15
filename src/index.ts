
import { compare } from './compare';
export default compare;

export type Configuration = Config;
export type Word = Block;
export namespace Word
{
    export type NonNumeric = NonNumericBlock;
    export type Numeric = NumericBlock;
    export type Custom = CustomBlock;
}

export type LetterCluster = Cluster;
