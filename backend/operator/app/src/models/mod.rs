use axum::async_trait;
use ethers::prelude::*;

pub mod utgard;
pub mod database;
pub mod sqlite;

#[derive(thiserror::Error, Debug)]
pub enum UtgardError {}

pub type Result<T> = std::result::Result<T, UtgardError>;


#[async_trait]
pub trait ContractClient {
    fn new(wallet: LocalWallet, contract: Address, rpc_url: &str) -> Self;
    async fn register_game(&self, game_id: u32, pubkey: Address) -> Result<Address>;
    async fn register_collection(&self, game_id: u32, collection_id: u128, cid: &str) -> Result<u128>;
}


