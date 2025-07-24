use anchor_lang::prelude::*;

declare_id!("57dQeDA9wvwsx7dWfwzgEL1U5TELwptQeMxbBcKNQWmd");

#[program]
pub mod anchor_dice {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
