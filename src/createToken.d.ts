import { Connection, Keypair } from '@solana/web3.js';
interface CreateTokenParams {
    connection: Connection;
    payer: Keypair;
    name: string;
    symbol: string;
    uri: string;
    buyAmountSol: number;
}
export declare function createAndBuyToken({ connection, payer, name, symbol, uri, buyAmountSol, }: CreateTokenParams): Promise<string>;
export {};
//# sourceMappingURL=createToken.d.ts.map