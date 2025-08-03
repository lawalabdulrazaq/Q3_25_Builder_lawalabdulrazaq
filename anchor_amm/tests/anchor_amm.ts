import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorAmm } from "../target/types/anchor_amm";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as spl from "@solana/spl-token"

describe("anchor amm", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider) 

  const program = anchor.workspace.anchor_amm as Program<AnchorAmm>;

  const seed = new anchor.BN(1); 
  const fee = 30;
  const user = Keypair.generate(); 
  
  let usertokenx: PublicKey, usertokeny: PublicKey; 
  let tokenmintx: PublicKey, tokenminty: PublicKey; 
  let tokenvaultx: PublicKey, tokenvaulty: PublicKey; 
  let config: PublicKey; 
  let tokenmintlp: PublicKey, usermintlp: PublicKey;

  before(async () => {
        // Airdrop SOL to the user
        const airdropsignature = await provider.connection.requestAirdrop(user.publicKey, 
            2 * anchor.web3.LAMPORTS_PER_SOL 
        );
        await provider.connection.confirmTransaction(airdropsignature); 

        // Create mints for token X and Y
        tokenmintx = await spl.createMint(
            provider.connection,
            user,
            user.publicKey,
            null,
            6
        ); 

        tokenminty = await spl.createMint(
            provider.connection,
            user,
            user.publicKey,
            null,
            6
        );

        // Derive config PDA
        const [configPDA, _bump] = PublicKey.findProgramAddressSync(
            [Buffer.from("config"), seed.toArrayLike(Buffer, "le", 8)],
            program.programId
        );
        config = configPDA;

        // Derive tokenmintlp from config PDA - this will be a PDA mint
        const [mintLpPDA, _lpBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("lp"), config.toBuffer()],
            program.programId
        );
        tokenmintlp = mintLpPDA; 

        // Derive vault accounts for token X and Y
        // These are owned by the config PDA
        tokenvaultx = spl.getAssociatedTokenAddressSync(tokenmintx, config, true);
        
        tokenvaulty = spl.getAssociatedTokenAddressSync(tokenminty, config, true);

        // Create associated token accounts for X and Y tokens
        const usertokenxATA = await spl.getOrCreateAssociatedTokenAccount(
            provider.connection, 
            user, // Payer and signer
            tokenmintx,
            user.publicKey // Owner of the ATA
        );
        usertokenx = usertokenxATA.address;

        const usertokenyATA = await spl.getOrCreateAssociatedTokenAccount(
            provider.connection,
            user, // Payer and signer
            tokenminty, 
            user.publicKey // Owner of the ATA
        );
        usertokeny = usertokenyATA.address;
        
        // This is the user's LP token account. The LP mint itself will be a PDA.
        usermintlp = spl.getAssociatedTokenAddressSync(tokenmintlp, user.publicKey);
        
        // Mint tokens to the user's accounts
        await spl.mintTo(
            provider.connection,
            user,
            tokenmintx,
            usertokenx,
            user,
            200000000000
        )
        
        await spl.mintTo(
            provider.connection, 
            user,
            tokenminty,
            usertokeny,
            user,
            200000000000
        )
    });

  it("Is initialized!", async () => {
        const tx = await program.methods.initialize(seed, fee, null).accountsPartial({
            initializer: user.publicKey,
            mintX: tokenmintx,
            mintY: tokenminty,
            mintLp: tokenmintlp,
            vaultX: tokenvaultx,
            vaultY: tokenvaulty,
            config: config,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY, // Add the Rent sysvar
        }).signers([user]).rpc();
        
        console.log("Your transaction signature", tx);
        console.log("AMM initialized successfully");

    });

  it("deposit tokens", async () => {
    const tx = await program.methods.deposit(
      new anchor.BN(2000000),
      new anchor.BN(1000000),
      new anchor.BN(1000000)
    ).accountsPartial({
      user: user.publicKey,
      mintX: tokenmintx,
      mintY: tokenminty,
      mintLp: tokenmintlp,
      config,
      vaultX: tokenvaultx,
      vaultY: tokenvaulty,
      userX: usertokenx,
      userY: usertokeny,
      userLp: usermintlp,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId
    }).signers([user]).rpc()

    console.log("Your transaction signature", tx);
  })

  it("swap token_x for token_y", async () => {
    const tx = await program.methods.swap(
      true, 
      new anchor.BN(2345), 
      new anchor.BN(1)
    ).accountsPartial({
      user: user.publicKey,
      mintX: tokenmintx,
      mintY: tokenminty,
      vaultX: tokenvaultx,
      vaultY: tokenvaulty,
      config, 
      userX: usertokenx,
      userY: usertokeny,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId 
    }).signers([user]).rpc();

    console.log("Your transaction signature", tx);
  })

  it("withdraw tokens", async () => {
    const tx = await program.methods.withdraw(
      new anchor.BN(2000000), 
      new anchor.BN(1), 
      new anchor.BN(1)  
    ).accountsPartial({
      user: user.publicKey,
      mintX: tokenmintx,
      mintY: tokenminty,
      mintLp: tokenmintlp,
      config,
      vaultX: tokenvaultx,
      vaultY: tokenvaulty,
      userX: usertokenx,
      userY: usertokeny,
      userLp: usermintlp,
      tokenProgram: spl.TOKEN_PROGRAM_ID,
      associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId
    }).signers([user]).rpc();

    console.log("Your transaction signature", tx);
  })
});