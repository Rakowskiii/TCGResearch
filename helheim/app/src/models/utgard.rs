use std::sync::Arc;

use axum::async_trait;
use ethers::prelude::*;

use bindings::cards::Cards;

use crate::models::ContractClient;

#[derive(Clone, Debug)]
pub struct UtgardClient {
    cards: Cards<SignerMiddleware<Provider<Http>, LocalWallet>>,
}


#[async_trait]
impl ContractClient for UtgardClient {
    fn new(wallet: LocalWallet, contract: Address, rpc_url: &str) -> Self {
        let client = Provider::<Http>::try_from(rpc_url).unwrap();//
        let client = Arc::new(SignerMiddleware::new(client, wallet));

        let contract = Cards::new(contract, Arc::clone(&client));

        Self {
            cards: contract
        }
    }
    async fn register_game(&self, game_id: u32, pubkey: Address) -> crate::models::Result<Address> {
        let tx = self.cards.register_minter_role(game_id, pubkey);

        tx.send().await.unwrap();
        //TODO: fix this
        Ok(pubkey)
    }

    async fn register_collection(&self, game_id: u32, collection_id: u128, cid: &str) -> crate::models::Result<u128> {
        let tx = self.cards.register_collection(game_id, collection_id, cid.to_string());
        tx.send().await.unwrap();
        Ok(collection_id)
    }
}