use axum::http::header::SET_COOKIE;
use axum::http::StatusCode;
use ethers::prelude::*;

#[derive(serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LoginData {
    username: String,
    password: String,
}

pub async fn handler(
    axum::extract::State(state): axum::extract::State<crate::appstate::AppState>,
    axum::extract::Json(login_data): axum::extract::Json<LoginData>,
) -> impl axum::response::IntoResponse {
    let LoginData { username, password } = login_data;
    let token = crate::controllers::login::controller(&state, &username, &password).await.unwrap();


    (StatusCode::OK, axum::response::AppendHeaders([
        (SET_COOKIE, format!("authorization={token}"))
    ]), ())
}