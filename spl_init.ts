import { createMint } from "@solana/spl-token";
import {
    Keypair, 
    Connection
} from "@solana/web3.js";
import base58 from "bs58";
import {
    writeFile,
    readFile
} from "fs/promises";

const WALLET_PATH = "./wallet";
const MINT_PATH = "./mint";
const connection = new Connection("https://api.devnet.solana.com", "finalized");

(async function () {
    const wallet = await readFile(WALLET_PATH, "utf8");
    const keypair = Keypair.fromSecretKey(base58.decode(wallet.toString()));
    console.log("Read wallet address with public key", keypair.publicKey.toBase58());

    const mint = await createMint(
        connection,
        keypair,
        keypair.publicKey,
        null,
        6,
    );
    await writeFile(MINT_PATH, mint.toBase58());
    console.log("Mint address:", mint.toBase58());
})();