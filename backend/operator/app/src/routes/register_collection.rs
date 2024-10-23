use axum::http::StatusCode;

use crate::extractors::auth::AuthenticatedUser;
use crate::utils::jwt::Role;

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CollectionRegisterData {
    game_id: u32,
    collection_id: u128,
    cid: String,
}

pub async fn handler(
    AuthenticatedUser { username: _, role }: AuthenticatedUser,
    axum::extract::State(state): axum::extract::State<crate::appstate::AppState>,
    axum::extract::Json(register_data): axum::extract::Json<CollectionRegisterData>,
) -> impl axum::response::IntoResponse {
    if role  != Role::GameDev {
        return (StatusCode::UNAUTHORIZED, "Missing permission.");
    }

    let CollectionRegisterData { game_id, collection_id, cid } = register_data;
    crate::controllers::register_collection::controller(state.client, game_id, collection_id, &cid).await;

    (StatusCode::OK, "Registered collection")
}