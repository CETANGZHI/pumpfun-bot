"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndBuyToken = createAndBuyToken;
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@coral-xyz/anchor");
var spl_token_1 = require("@solana/spl-token");
var fs = require("fs");
var path = require("path");
// Load IDL
var idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'idl.json'), 'utf8'));
// pump.fun program ID
var PUMPFUN_PROGRAM_ID = new web3_js_1.PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
// Metaplex Token Metadata Program ID
var MPL_TOKEN_METADATA_PROGRAM_ID = new web3_js_1.PublicKey('metaqbxxUerdq28cj1RbbAWkYQm3ybzjb6a8bt518x1s');
function createAndBuyToken(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var provider, program, mint, mintAuthority, globalAccount, bondingCurve, metadataAccount, associatedBondingCurve, associatedUserTokenAccount, createIx, buyIx, transaction, signature, error_1;
        var connection = _b.connection, payer = _b.payer, name = _b.name, symbol = _b.symbol, uri = _b.uri, buyAmountSol = _b.buyAmountSol;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(payer), { commitment: 'confirmed' });
                    program = new anchor_1.Program(idl, PUMPFUN_PROGRAM_ID, provider);
                    mint = web3_js_1.Keypair.generate();
                    mintAuthority = payer.publicKey;
                    globalAccount = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('global')], PUMPFUN_PROGRAM_ID)[0];
                    bondingCurve = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('bonding-curve'), mint.publicKey.toBuffer()], PUMPFUN_PROGRAM_ID)[0];
                    metadataAccount = web3_js_1.PublicKey.findProgramAddressSync([
                        Buffer.from('metadata'),
                        MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                        mint.publicKey.toBuffer(),
                    ], MPL_TOKEN_METADATA_PROGRAM_ID)[0];
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint.publicKey, bondingCurve, true, // allowOwnerOffCurve
                        spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID)];
                case 1:
                    associatedBondingCurve = _c.sent();
                    return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint.publicKey, payer.publicKey, false, // disallowOwnerOffCurve
                        spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID)];
                case 2:
                    associatedUserTokenAccount = _c.sent();
                    console.log('Creating token:', name, symbol);
                    console.log('Mint:', mint.publicKey.toBase58());
                    console.log('Bonding Curve:', bondingCurve.toBase58());
                    console.log('Metadata Account:', metadataAccount.toBase58());
                    return [4 /*yield*/, program.methods
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
                            systemProgram: web3_js_1.SystemProgram.programId,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            associatedTokenProgram: spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID,
                            rent: web3_js_1.SYSVAR_RENT_PUBKEY, // Corrected: Use SYSVAR_RENT_PUBKEY
                            eventAuthority: globalAccount, // Assuming global is also event authority
                            program: PUMPFUN_PROGRAM_ID,
                        })
                            .signers([mint, payer])
                            .instruction()];
                case 3:
                    createIx = _c.sent();
                    return [4 /*yield*/, program.methods
                            .buy(new anchor_1.BN(buyAmountSol * Math.pow(10, 9)), new anchor_1.BN(buyAmountSol * Math.pow(10, 9) * 1.1)) // amount, maxSolCost (with 10% buffer)
                            .accounts({
                            global: globalAccount,
                            feeRecipient: globalAccount, // Assuming fee recipient is global for now
                            mint: mint.publicKey,
                            bondingCurve: bondingCurve,
                            associatedBondingCurve: associatedBondingCurve,
                            associatedUser: associatedUserTokenAccount,
                            user: payer.publicKey,
                            systemProgram: web3_js_1.SystemProgram.programId,
                            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                            rent: web3_js_1.SYSVAR_RENT_PUBKEY, // Corrected: Use SYSVAR_RENT_PUBKEY
                            eventAuthority: globalAccount, // Assuming global is also event authority
                            program: PUMPFUN_PROGRAM_ID,
                        })
                            .instruction()];
                case 4:
                    buyIx = _c.sent();
                    transaction = new web3_js_1.Transaction().add(createIx).add(buyIx);
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [payer, mint], { commitment: 'confirmed' })];
                case 6:
                    signature = _c.sent();
                    console.log('Transaction confirmed with signature:', signature);
                    return [2 /*return*/, mint.publicKey.toBase58()];
                case 7:
                    error_1 = _c.sent();
                    console.error('Failed to create and buy token:', error_1);
                    throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
