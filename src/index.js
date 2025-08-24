"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const createToken_1 = require("./createToken");
const metadata_1 = require("./metadata");
// pump.fun program ID (from previous research)
const PUMPFUN_PROGRAM_ID = new web3_js_1.PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
// Connect to Solana Devnet for testing
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'), 'confirmed');
async function main() {
    console.log('Connecting to Solana Devnet...');
    console.log('Connected to:', connection.rpcEndpoint);
    // Generate a new keypair for testing (DO NOT use in production with real funds)
    const payer = web3_js_1.Keypair.generate();
    console.log('Payer Public Key:', payer.publicKey.toBase58());
    // Request airdrop for testing (only on devnet/testnet)
    console.log('Requesting airdrop...');
    const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * 10 ** 9); // 2 SOL
    await connection.confirmTransaction(airdropSignature, 'confirmed');
    console.log('Airdrop confirmed.');
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Payer balance: ${balance / 10 ** 9} SOL`);
    // Generate token name, symbol, and description
    const { name: tokenName, symbol: tokenSymbol } = (0, metadata_1.generateTokenNameAndSymbol)();
    const tokenDescription = (0, metadata_1.generateTokenDescription)(tokenName, tokenSymbol);
    // Placeholder for actual image generation and upload
    const imageUrl = await (0, metadata_1.uploadImageAndGetUri)(tokenName, tokenSymbol);
    // Generate and upload metadata JSON
    const tokenUri = await (0, metadata_1.generateAndUploadMetadata)(tokenName, tokenSymbol, tokenDescription, imageUrl);
    const buyAmount = 0.01; // Buy 0.01 SOL worth of tokens after creation
    try {
        const newTokenMint = await (0, createToken_1.createAndBuyToken)({
            connection,
            payer,
            name: tokenName,
            symbol: tokenSymbol,
            uri: tokenUri,
            buyAmountSol: buyAmount,
        });
        console.log('Successfully created and bought token with mint:', newTokenMint);
    }
    catch (error) {
        console.error('Error during token creation and buying:', error);
    }
}
main().catch(err => {
    console.error(err);
});
//# sourceMappingURL=index.js.map