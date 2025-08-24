import { Connection, PublicKey, clusterApiUrl, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createAndBuyToken } from './createToken.js'; // Added .js extension
import { generateTokenNameAndSymbol, generateTokenDescription, uploadImageAndGetUri, generateAndUploadMetadata } from './metadata.js'; // Added .js extension

// pump.fun program ID (from previous research)
const PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');

// Connect to Solana Mainnet-beta
const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

async function main() {
    console.log('Connecting to Solana Mainnet-beta...');
    console.log('Connected to:', connection.rpcEndpoint);

    // Generate a new keypair for testing (DO NOT use in production with real funds)
    // For mainnet, you would load a funded keypair here.
    const payer = Keypair.generate();
    console.log('Payer Public Key:', payer.publicKey.toBase58());

    // Request airdrop is not available on mainnet-beta. You need to fund this wallet manually.
    console.log('Airdrop is not available on mainnet-beta. Please fund this wallet manually.');
    console.log('Payer Public Key:', payer.publicKey.toBase58());
    console.log('Waiting for 10 seconds for manual funding...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds

    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Payer balance: ${balance / 10**9} SOL`);

    if (balance < 0.02 * 10**9) { // Check if balance is sufficient for creation and buy
        console.error('Insufficient SOL balance for token creation and buying. Please fund the payer wallet.');
        return;
    }

    // Generate token name, symbol, and description
    const { name: tokenName, symbol: tokenSymbol } = generateTokenNameAndSymbol();
    const tokenDescription = generateTokenDescription(tokenName, tokenSymbol);

    // Placeholder for actual image generation and upload
    const imageUrl = await uploadImageAndGetUri(tokenName, tokenSymbol);

    // Generate and upload metadata JSON
    const tokenUri = await generateAndUploadMetadata(tokenName, tokenSymbol, tokenDescription, imageUrl);

    const buyAmount = 0.01; // Buy 0.01 SOL worth of tokens after creation

    try {
        const newTokenMint = await createAndBuyToken({
            connection,
            payer,
            name: tokenName,
            symbol: tokenSymbol,
            uri: tokenUri,
            buyAmountSol: buyAmount,
        });
        console.log('Successfully created and bought token with mint:', newTokenMint);
    } catch (error) {
        console.error('Error during token creation and buying:', error);
    }
}

main().catch(err => {
    console.error(err);
});


