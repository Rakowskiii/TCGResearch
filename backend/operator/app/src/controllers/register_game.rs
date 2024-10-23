use ethers::prelude::*;

pub async fn controller(
    client: impl crate::models::ContractClient,
    game_id: u32,
    address: Address,
) {
    client.register_game(game_id, address).await.unwrap();
}
