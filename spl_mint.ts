import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import {
    Keypair, 
    Connection,
    PublicKey
} from "@solana/web3.js";
import base58 from "bs58";
import {
    readFile
} from "fs/promises";

const WALLET_PATH = "./wallet";
const MINT_PATH = "./mint";
const connection = new Connection("https://api.devnet.solana.com", "finalized");

(async function () {
    const wallet = await readFile(WALLET_PATH, "utf8");
    const keypair = Keypair.fromSecretKey(base58.decode(wallet.toString()));
    console.log("Read wallet address with public key", keypair.publicKey.toBase58());
    const mint = new PublicKey(await readFile(MINT_PATH, "utf8"));
    console.log("Read mint address:", mint.toBase58());

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        mint,
        keypair.publicKey,
    );

    const ata = tokenAccount.address;
    console.log("Associated Token Account: ", ata.toBase58());

    const amount = 10e6;

    const txSignature = await mintTo(
        connection,
        keypair,
        mint,
        ata,
        keypair.publicKey,
        amount
    );

    console.log("Minted", amount, "to", ata.toBase58());
    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txSignature}?cluster=devnet`);
})();