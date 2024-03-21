use axum::http::StatusCode;
use ethers::prelude::*;

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UserRegisterData {
    username: String,
    password: String,
}

pub async fn handler(
    axum::extract::State(state): axum::extract::State<crate::appstate::AppState>,
    axum::extract::Json(register_data): axum::extract::Json<UserRegisterData>,
) -> impl axum::response::IntoResponse {
    let UserRegisterData { username, password } = register_data;

    if let Err(e) = crate::controllers::register_user::controller(&state, &username, &password).await {
        tracing::error!("Error registering user: {}", e);
        return (StatusCode::BAD_REQUEST, e.to_string());
    }

    (StatusCode::OK, String::from("User registered"))
}