use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Offer {
    // Details of the offer made, e.g. what who made it and what they want in return.
    // The `id` is used to uniquely identify the offer.
    pub id: u64,
    // The `maker` is the public key of the user who created the offer.
    pub maker: Pubkey,
    // the token mints been offered.
    pub token_mint_a: Pubkey,
    // the token mints been requested in return.
    // This is the token mint that the maker wants in exchange for their offer.
    pub token_mint_b: Pubkey,
    // The amount of token b wanted by maker.
    pub token_b_amount: u64,
    // Used to calculate the address for this account, we save it as a performance optimization.
    pub bump: u8,
    
}
