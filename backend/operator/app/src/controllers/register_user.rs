use argon2::password_hash::Salt;
use argon2::PasswordHasher;
use rand::Rng;

use crate::models::database::Database;

pub async fn controller(
    state: &crate::appstate::AppState,
    username: &str,
    password: &str,
    mail: &str,
) -> crate::types::Result<crate::utils::jwt::Jwt> {
    let argon = argon2::Argon2::default();
    let salt_string: String = rand::thread_rng()
        .sample_iter(&rand::distributions::Alphanumeric)
        .take(32)
        .map(char::from)
        .collect();
    let hash = argon
        .hash_password(password.as_ref(), Salt::from_b64(&salt_string).unwrap())
        .unwrap();
    state
        .insert_user(
            &username,
            &hash.to_string(),
            &mail,
            crate::utils::jwt::Role::GameDev,
        )
        .await?;
    state.generate_token(username.to_string(), crate::utils::jwt::Role::GameDev)
}
