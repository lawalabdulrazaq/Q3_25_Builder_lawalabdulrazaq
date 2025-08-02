use anchor_lang::prelude::*;
use crate::{error::ErrorCode, state::Offer};
use anchor_spl::{
    associated_token::{self, AssociatedToken},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

#[derive(Accounts)]
pub struct TakeOffer<'info> {
    // TakeOffer (in capitals) is a struct of names accounts that the
    // take_offer() function will use.

    // Used to manage associated token accounts
    // ie where a wallet holds a specific type of token
    pub associated_token_program: Program<'info, AssociatedToken>,

    // Works with either the classic token program or
    // the newer token extensions program
    pub token_program: Interface<'info, TokenInterface>,

    // Used to create accounts
    pub system_program: Program<'info, System>,


}

// Handle the take offer instruction by:
// 1. Sending the wanted tokens from the taker to the maker
// 2. Withdrawing the offered tokens from the vault to the taker and closing the vault
pub fn take_offer(_context: Context<TakeOffer>) -> Result<()> {
    Ok(())
}
