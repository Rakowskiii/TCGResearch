use std::fmt::Debug;

use axum::extract::{FromRef, FromRequestParts};
use axum::http::request::Parts;
use axum::{async_trait, RequestPartsExt};

#[derive(Debug)]
pub struct AuthenticatedUser {
    pub role: crate::utils::jwt::Role,
    pub username: String,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthenticatedUser
where
    crate::appstate::AppState: FromRef<S>,
    S: Sized + Send + Sync + Debug,
{
    type Rejection = (axum::http::StatusCode, &'static str);

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let app_state: crate::appstate::AppState = parts
            .extract_with_state::<crate::appstate::AppState, _>(state)
            .await?;

        match parts.headers.get(axum::http::header::AUTHORIZATION) {
            Some(bearer) => {
                let auth = bearer
                    .to_str()
                    .unwrap_or("")
                    .to_string()
                    .strip_prefix("Bearer ")
                    .unwrap_or("")
                    .to_string();
                let token = crate::utils::jwt::Jwt(auth);
                return match app_state.validate_token(&token) {
                    Err(_) => Err((axum::http::StatusCode::UNAUTHORIZED, "Invalid auth token.")),
                    Ok(claims) => Ok(AuthenticatedUser {
                        role: claims.rol,
                        username: claims.sub,
                    }),
                };
            }
            None => Err((axum::http::StatusCode::UNAUTHORIZED, "Auth header missing")),
        }
    }
}
