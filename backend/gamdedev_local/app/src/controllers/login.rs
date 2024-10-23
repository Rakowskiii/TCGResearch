use argon2::PasswordVerifier;

use crate::models::database::Database;

pub async fn controller(
    state: &crate::appstate::AppState,
    username: &str,
    password: &str,
) -> crate::types::Result<crate::utils::jwt::Jwt> {
    let argon = argon2::Argon2::default();
    let user = state.get_user(username).await?;
    argon.verify_password(
        password.as_ref(),
        &argon2::password_hash::PasswordHash::new(&user.password_hash)
            .map_err(|_| crate::types::Error::Argon)?,
    ).map_err(|_| crate::types::Error::Argon)?;

    state.generate_token(user.username, user.role)
}