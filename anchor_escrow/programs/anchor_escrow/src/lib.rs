#![allow(unexpected_cfgs)]
#![allow(deprecated)]
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("9HRKSYBSvDPkSZt8VVUK5RYTrmiKir7ywpgKeEB86hxi");

#[program]
pub mod anchor_escrow {
    use super::*;

}
