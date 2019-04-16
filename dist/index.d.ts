import { Config, Block, NonNumericBlock, NumericBlock, CustomBlock, Cluster } from "./types";
import { compare } from './compare';
export default compare;
export declare type Configuration = Config;
export { Block };
export declare namespace Block {
    type NonNumeric = NonNumericBlock;
    type Numeric = NumericBlock;
    type Custom = CustomBlock;
}
export declare type AlphabetEntry = Cluster;
//# sourceMappingURL=index.d.ts.map