use std::fmt::LowerHex;

use axum::http::StatusCode;
use base64::Engine;
use base64::prelude::BASE64_URL_SAFE_NO_PAD;
use rand::random;

use crate::extractors::auth::AuthenticatedUser;
use crate::utils::jwt::Role;

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SignBoosterData {
    tokens: Vec<ethers::types::U256>,
    nonce: [u8; 32],
}

pub async fn handler(
    AuthenticatedUser { username: _, role }: AuthenticatedUser,
    axum::extract::Json(generate_booster_data): axum::extract::Json<SignBoosterData>,
) -> impl axum::response::IntoResponse {
    //TODO: Owenr of the collection
    if role != Role::GameDev {
        return (StatusCode::UNAUTHORIZED, String::from("Missing permission."));
    }

    let SignBoosterData { tokens, nonce } = generate_booster_data;

    (
        StatusCode::OK,
        format!("tcg://claimBooster:{}", BASE64_URL_SAFE_NO_PAD.encode(serde_json::to_string(&crate::controllers::sign_booster::controller(tokens, nonce).await).unwrap()))
    )
}

#[test]
fn generate_booster() {
    let game_id = 1;
    let collection_id = 1;

    let game_id = int_to_padded_hex(game_id, crate::controllers::sign_booster::GAME_ID_LEN);
    let collection_id = int_to_padded_hex(collection_id, crate::controllers::sign_booster::COLLECTION_ID_LEN);
    let rarity = int_to_padded_hex(1, crate::controllers::sign_booster::RARITY_LEN);
    let nonce: [u8; 32] = random();


    let tokens = vec![
        ethers::types::U256::from_str_radix(&format!("{game_id}{collection_id}{rarity}{}", int_to_padded_hex(0, crate::controllers::sign_booster::CARD_ID_LEN)), 16).unwrap(),
        ethers::types::U256::from_str_radix(&format!("{game_id}{collection_id}{rarity}{}", int_to_padded_hex(1, crate::controllers::sign_booster::CARD_ID_LEN)), 16).unwrap(),
        ethers::types::U256::from_str_radix(&format!("{game_id}{collection_id}{rarity}{}", int_to_padded_hex(2, crate::controllers::sign_booster::CARD_ID_LEN)), 16).unwrap(),
        ethers::types::U256::from_str_radix(&format!("{game_id}{collection_id}{rarity}{}", int_to_padded_hex(3, crate::controllers::sign_booster::CARD_ID_LEN)), 16).unwrap(),
        ethers::types::U256::from_str_radix(&format!("{game_id}{collection_id}{rarity}{}", int_to_padded_hex(4, crate::controllers::sign_booster::CARD_ID_LEN)), 16).unwrap(),
        ethers::types::U256::from_str_radix(&format!("{game_id}{collection_id}{rarity}{}", int_to_padded_hex(5, crate::controllers::sign_booster::CARD_ID_LEN)), 16).unwrap(),
        ethers::types::U256::from_str_radix(&format!("{game_id}{collection_id}{rarity}{}", int_to_padded_hex(6, crate::controllers::sign_booster::CARD_ID_LEN)), 16).unwrap(),
    ];

    let data = SignBoosterData {
        tokens,
        nonce,
    };

    println!("{}",
             serde_json::to_string(&data).unwrap()
    );
}
