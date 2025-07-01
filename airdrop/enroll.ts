import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js"
import { Idl, Program, Wallet, AnchorProvider } from "@coral-xyz/anchor"
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json"

const MPL_CORE_PROGRAM_ID = new
PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
commitment: "confirmed"});

// Create our program
const program: Program<Idl> = new Program(IDL as Idl, provider);

// Create the PDA for our enrollment account

// Derive the PDA for the prereq account
const account_seeds = [
Buffer.from("prereqs"),
keypair.publicKey.toBuffer(),
];
const [account_key, _account_bump] =
PublicKey.findProgramAddressSync(account_seeds, program.programId);

const mintCollection = new
PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");
// Derive the authority PDA for the collection
const authority_seeds = [
Buffer.from("collection"),
mintCollection.toBuffer(),
];
const [authority, _authority_bump] =
  PublicKey.findProgramAddressSync(authority_seeds, program.programId);

const mintTs = Keypair.generate();

// Execute the initialize transaction
(async () => {
    try {
        const txhash = await program.methods
        .initialize("lawalabdulrazaq")
        .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        system_program: SystemProgram.programId,
        })
        .signers([keypair])
        .rpc();
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();

// Execute the submitTs transaction
(async () => {
    try {
        const txhash = await program.methods
        .submitTs()
        .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: mintCollection,
        authority,
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SystemProgram.programId,
        })
        .signers([keypair, mintTs])
        .rpc();
        console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`);
    }
})();