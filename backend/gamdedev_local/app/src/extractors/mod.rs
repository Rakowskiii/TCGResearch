use std::fmt::Debug;
use axum::extract::FromRef;
use axum::http::request::Parts;

pub mod auth;

#[axum::async_trait]
impl<S> axum::extract::FromRequestParts<S> for crate::appstate::AppState
    where
        Self: axum::extract::FromRef<S>, // <---- added this line
        S: Send + Sync + Debug,
{
    type Rejection = (axum::http::StatusCode, &'static str);

    async fn from_request_parts(_parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        Ok(Self::from_ref(state))
    }
}