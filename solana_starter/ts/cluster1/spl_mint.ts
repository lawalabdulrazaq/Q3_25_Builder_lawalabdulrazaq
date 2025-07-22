import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "./wallet/turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("41CA57msDJx1X7JpTmq6w2p6ZkSHJ8LZSkPGHEqvpx7s");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair.publicKey,
            1000n * token_decimals // 1000 tokens with 6 decimals
        )
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

// Your ata is: B1kDt1njaC7YZuerDi3HkxDak5YnPxJcnutDuT6UXouX
// Your mint txid: 65Q4Z1bbR47add22F8vFwwdhTYGJynS9jUNU8XRzuNZHFqsXfECn3Xjzpg6YMGS4WgYP3Nh554b1QEgjX2XXg1zm
