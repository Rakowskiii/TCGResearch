pub async fn controller(client: impl crate::models::ContractClient, game_id: u32, collection_id: u128, cid: &str) {
    client.register_collection(game_id, collection_id, cid).await.unwrap();
}