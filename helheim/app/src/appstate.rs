use crate::types::ClientId;
use crate::utils::jwt::Claims;

#[derive(Clone, Debug)]
pub struct AppState {
    pub client: crate::models::utgard::UtgardClient,
    pub db: sqlx::SqlitePool,
    pub shared_secret: [u8; 32],
}

//TODO: add builder

impl AppState {
    pub fn generate_token(
        &self,
        client_id: ClientId,
        role: crate::utils::jwt::Role,
    ) -> crate::types::Result<crate::utils::jwt::Jwt> {
        let token = crate::utils::jwt::generate_token(client_id, &self.shared_secret, role)?;
        Ok(token)
    }

    pub fn validate_token(&self, token: &crate::utils::jwt::Jwt) -> crate::types::Result<Claims> {
        let claims = crate::utils::jwt::validate_token(token, &self.shared_secret)?;
        Ok(claims)
    }
}
