import {
    Keypair, 
    Connection,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import base58 from "bs58";
import {
    readFile
} from "fs/promises";

const WALLET_PATH = "./wallet";
const connection = new Connection("https://api.devnet.solana.com", "finalized");

(async function () {
    const wallet = await readFile(WALLET_PATH, "utf8");
    const keypair = Keypair.fromSecretKey(base58.decode(wallet.toString()));
    console.log("Read wallet address with public key", keypair.publicKey.toBase58());

    const amount = 2;

    try {
        const airdropSignature = await connection.requestAirdrop(
            keypair.publicKey,
            amount * LAMPORTS_PER_SOL
        );
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${airdropSignature}?cluster=devnet`);
    } catch (error) {
        console.error(error);
    }
})();