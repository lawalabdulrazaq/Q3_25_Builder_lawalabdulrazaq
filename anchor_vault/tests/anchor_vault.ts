import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVault } from "../target/types/anchor_vault";
import { assert } from "chai";

describe("anchor_vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.anchorVault as Program<AnchorVault>;

  const user = anchor.AnchorProvider.env().wallet;
  let vaultState: anchor.web3.PublicKey;
  let vault: anchor.web3.PublicKey;

  it("Initialize vault", async () => {
    [vaultState] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state"), user.publicKey.toBuffer()],
      program.programId
    );

    [vault] = await anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), user.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        user: user.publicKey,
        vaultState: vaultState,
        vault: vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

      console.log("Initialized vault tx:", tx);
  });

  it("Deposit into vault", async () => {
    const depositAmount = new anchor.BN(1000000); // 1 SOL in lamports

    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        user: user.publicKey,
        vaultState: vaultState,
        vault: vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Deposit tx:", tx);
  });

  it("Withdraw from vault", async () => {
    const withdrawAmount = new anchor.BN(500000); // 0.5 SOL in lamports

    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        user: user.publicKey,
        vaultState: vaultState,
        vault: vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Withdraw tx:", tx);
  });

  it("close vault and refund lamports", async () => {
    const beforeBalance = await anchor.AnchorProvider.env().connection.getBalance(user.publicKey);

    const tx = await program.methods
      .closeVault()
      .accounts({
        user: user.publicKey,
        vaultState: vaultState,
        vault: vault,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

      const afterBalance = await anchor.AnchorProvider.env().connection.getBalance(user.publicKey);

    console.log("Close vault tx:", tx);
    assert.ok(afterBalance > beforeBalance, "User should receive lamports back");
  })
});
