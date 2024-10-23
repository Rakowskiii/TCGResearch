use axum::http::StatusCode;
use ethers::prelude::*;

use crate::extractors::auth::AuthenticatedUser;
use crate::utils::jwt::Role;

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameRegisterData {
    game_id: u32,
    address: Address,
}

pub async fn handler(
    AuthenticatedUser { username: _, role }: AuthenticatedUser,
    axum::extract::State(state): axum::extract::State<crate::appstate::AppState>,
    axum::extract::Json(register_data): axum::extract::Json<GameRegisterData>,
) -> impl axum::response::IntoResponse {
    if role != Role::Admin {
        return (StatusCode::UNAUTHORIZED, "Missing permission.");
    }

    let GameRegisterData { game_id, address } = register_data;
    crate::controllers::register_game::controller(state.client, game_id, address).await;

    (StatusCode::OK, "Game registered")
}
