use ethers::prelude::*;

pub async fn controller(client: impl crate::models::ContractClient, game_id: u32, address: Option<Address>) {
    let address = match address {
        // TODO: add database, and handle generating new address
        None => todo!(),
        Some(address) => address
    };

    client.register_game(game_id, address).await.unwrap();
}