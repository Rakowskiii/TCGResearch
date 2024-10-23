pub type Id = i64;

#[derive(Debug, Clone)]
pub struct User {
    pub id: Id,
    pub username: String,
    pub password_hash: String,
    pub mail: String,
    pub role: crate::utils::jwt::Role,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Game {
    pub id: Id,
    pub name: String,
    pub admin_id: Id,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Key {
    pub id: Id,
    pub game_id: Id,
    pub user_id: Id,
    pub private_key: String,
}

#[axum::async_trait]
pub trait Database {
    async fn get_user(&self, username: &str) -> crate::types::Result<User>;

    async fn insert_user(
        &self,
        username: &str,
        password_hash: &str,
        mail: &str,
        role: crate::utils::jwt::Role,
    ) -> crate::types::Result<()>;
}
