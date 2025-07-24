import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVault } from "../target/types/anchor_vault";
import { assert } from "chai";

describe("anchor_vault", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.anchorVault as Program<AnchorVault>;
  const user = anchor.AnchorProvider.env().wallet;
  let vaultState: anchor.web3.PublicKey;
  let vault: anchor.web3.PublicKey;

  it("Initialize vault", async () => {
    [vaultState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("state"), user.publicKey.toBuffer()],
      program.programId
    );

    [vault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), user.publicKey.toBuffer()],
      program.programId
    );

    try {
      const tx = await program.methods
        .initialize()
        .accounts({
          user: user.publicKey,
          vaultState,
          vault,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any) // Use 'as any' to bypass TypeScript checking temporarily
        .rpc();

      console.log("Initialized vault tx:", tx);
    } catch (error) {
      console.error("Initialize error:", error);
      throw error;
    }
  });

  it("Deposit into vault", async () => {
    const depositAmount = new anchor.BN(1000000);

    try {
      const tx = await program.methods
        .deposit(depositAmount)
        .accounts({
          user: user.publicKey,
          vaultState,
          vault,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .rpc();

      console.log("Deposit tx:", tx);
    } catch (error) {
      console.error("Deposit error:", error);
      throw error;
    }
  });

  it("Withdraw from vault", async () => {
    const withdrawAmount = new anchor.BN(500000);

    try {
      const tx = await program.methods
        .withdraw(withdrawAmount)
        .accounts({
          user: user.publicKey,
          vaultState,
          vault,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .rpc();

      console.log("Withdraw tx:", tx);
    } catch (error) {
      console.error("Withdraw error:", error);
      throw error;
    }
  });

  it("close vault and refund lamports", async () => {
    const beforeBalance = await anchor.AnchorProvider.env().connection.getBalance(user.publicKey);

    try {
      const tx = await program.methods
        .closeVault()
        .accounts({
          user: user.publicKey,
          vaultState,
          vault,
          systemProgram: anchor.web3.SystemProgram.programId,
        } as any)
        .rpc();

      const afterBalance = await anchor.AnchorProvider.env().connection.getBalance(user.publicKey);

      console.log("Close vault tx:", tx);
      assert.ok(afterBalance > beforeBalance, "User should receive lamports back");
    } catch (error) {
      console.error("Close vault error:", error);
      throw error;
    }
  });
});