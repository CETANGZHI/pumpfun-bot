import { PublicKey, Keypair, Transaction, sendAndConfirmTransaction, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor'; // Import as a namespace
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import bs58 from 'bs58'; // Import bs58
// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load IDL
const idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'idl.json'), 'utf8'));
// pump.fun program ID
const PUMPFUN_PROGRAM_ID_STR = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
let PUMPFUN_PROGRAM_ID;
try {
    PUMPFUN_PROGRAM_ID = new PublicKey(PUMPFUN_PROGRAM_ID_STR);
    console.log("PUMPFUN_PROGRAM_ID is on curve:", PublicKey.isOnCurve(PUMPFUN_PROGRAM_ID));
}
catch (e) {
    console.error('Error initializing PUMPFUN_PROGRAM_ID:', e);
    throw e;
}
// Metaplex Token Metadata Program ID
const MPL_TOKEN_METADATA_PROGRAM_ID_STR = 'metaqbxxUerdq28cj1RbbAWkYQm3ybzjb6a8bt518x1s';
let MPL_TOKEN_METADATA_PROGRAM_ID;
try {
    // Use bs58.decode to initialize PublicKey
    const decodedBytes = bs58.decode(MPL_TOKEN_METADATA_PROGRAM_ID_STR);
    MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey(decodedBytes);
    console.log("MPL_TOKEN_METADATA_PROGRAM_ID is on curve:", PublicKey.isOnCurve(MPL_TOKEN_METADATA_PROGRAM_ID));
}
catch (e) {
    console.error('Error initializing MPL_TOKEN_METADATA_PROGRAM_ID:', e);
    throw e;
}
export async function createAndBuyToken({ connection, payer, name, symbol, uri, buyAmountSol, }) {
    const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(payer), { commitment: 'confirmed' });
    const program = new anchor.Program(idl, PUMPFUN_PROGRAM_ID, provider);
    const mint = Keypair.generate();
    const mintAuthority = payer.publicKey; // For simplicity, payer is mint authority
    // Derive PDA for bonding curve and metadata
    const [globalAccount] = PublicKey.findProgramAddressSync([Buffer.from('global')], PUMPFUN_PROGRAM_ID);
    const [bondingCurve] = PublicKey.findProgramAddressSync([Buffer.from('bonding-curve'), mint.publicKey.toBuffer()], PUMPFUN_PROGRAM_ID);
    const [metadataAccount] = PublicKey.findProgramAddressSync([
        Buffer.from('metadata'),
        MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
    ], MPL_TOKEN_METADATA_PROGRAM_ID);
    const associatedBondingCurve = await getAssociatedTokenAddress(mint.publicKey, bondingCurve, true, // allowOwnerOffCurve
    TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    const associatedUserTokenAccount = await getAssociatedTokenAddress(mint.publicKey, payer.publicKey, false, // disallowOwnerOffCurve
    TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
    console.log('Creating token:', name, symbol);
    console.log('Mint:', mint.publicKey.toBase58());
    console.log('Bonding Curve:', bondingCurve.toBase58());
    console.log('Metadata Account:', metadataAccount.toBase58());
    const createIx = await program.methods
        .create(name, symbol, uri)
        .accounts({
        mint: mint.publicKey,
        mintAuthority: mintAuthority,
        bondingCurve: bondingCurve,
        associatedBondingCurve: associatedBondingCurve,
        global: globalAccount,
        mplTokenMetadata: MPL_TOKEN_METADATA_PROGRAM_ID,
        metadata: metadataAccount,
        user: payer.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY, // Corrected: Use SYSVAR_RENT_PUBKEY
        eventAuthority: globalAccount, // Assuming global is also event authority
        program: PUMPFUN_PROGRAM_ID,
    })
        .signers([mint, payer])
        .instruction();
    // Prepare buy instruction
    const buyIx = await program.methods
        .buy(new anchor.BN(buyAmountSol * 10 ** 9), new anchor.BN(buyAmountSol * 10 ** 9 * 1.1)) // amount, maxSolCost (with 10% buffer)
        .accounts({
        global: globalAccount,
        feeRecipient: globalAccount, // Assuming fee recipient is global for now
        mint: mint.publicKey,
        bondingCurve: bondingCurve,
        associatedBondingCurve: associatedBondingCurve,
        associatedUser: associatedUserTokenAccount,
        user: payer.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY, // Corrected: Use SYSVAR_RENT_PUBKEY
        eventAuthority: globalAccount, // Assuming global is also event authority
        program: PUMPFUN_PROGRAM_ID,
    })
        .instruction();
    const transaction = new Transaction().add(createIx).add(buyIx);
    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [payer, mint], { commitment: 'confirmed' });
        console.log('Transaction confirmed with signature:', signature);
        return mint.publicKey.toBase58();
    }
    catch (error) {
        console.error('Failed to create and buy token:', error);
        throw error;
    }
}
