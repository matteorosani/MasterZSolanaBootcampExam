import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
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

    const keypair2 = Keypair.generate();
    console.log("New wallet generated with public key", keypair2.publicKey.toBase58());

    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        mint,
        keypair.publicKey,
    );

    const ata = tokenAccount.address;
    console.log("From Associated Token Account: ", ata.toBase58());

    const tokenAccount2 = await getOrCreateAssociatedTokenAccount(
        connection, 
        keypair,
        mint,
        keypair2.publicKey,
    );
    const ata2 = tokenAccount2.address;
    console.log("To Associated Token Account: ", ata2.toBase58());

    const amount = 1e6;

    const txSignature = await transfer(
        connection,
        keypair,
        ata,
        ata2,
        keypair,
        amount
    );

    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txSignature}?cluster=devnet`);
    console.log("Transferred", amount, "from", ata.toBase58(), "to", ata2.toBase58());
})();