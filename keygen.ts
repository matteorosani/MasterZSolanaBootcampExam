import {
    Keypair
} from "@solana/web3.js";
import base58 from "bs58";
import {
    writeFile
} from "fs/promises";

const WALLET_PATH = "./wallet";

(async function () {
    const keypair = Keypair.generate();
    await writeFile(WALLET_PATH, base58.encode(keypair.secretKey));
})();