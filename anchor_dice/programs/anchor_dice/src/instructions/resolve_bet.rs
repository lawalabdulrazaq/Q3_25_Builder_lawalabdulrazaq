use anchor_instruction_sysvar::{},

use solana_program::{
    ed25519_program, hash::hash
}

use crate::{errors::DiceError, state::Bet};

pub const HOUSE_EDGE: u16 = 150; // 1.5% House edge

#[derive(Accounts)]
pub struct ResolveBet<'info> {
    #[account(mut)]
    pub house: Signer<'info>,

    pub player: UncheckedAccount<'info>,

    #[account(
        mut,
        close = player,
        has_one = player,
        seeds = [b"bet", vault.key().as_ref(), bet.seed]
    )]

}