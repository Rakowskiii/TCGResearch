use crate::models::database::{Game, Id, Key, User};

#[axum::async_trait]
impl crate::models::database::Database for crate::appstate::AppState {
    async fn get_user(&self, username: &str) -> crate::types::Result<User> {
        let user = sqlx::query_as!(User,
            "SELECT * FROM Users WHERE username = ?",
            username
        )
            .fetch_one(&self.db).await?;

        Ok(user)
    }

    async fn get_games_owned_by(&self, username: &str) -> crate::types::Result<Vec<Game>> {
        todo!()
    }

    async fn get_key_for(&self, username: &str, game_id: crate::models::database::Id) -> crate::types::Result<Key> {
        todo!()
    }

    async fn insert_user(&self, username: &str, password_hash: &str, role: crate::utils::jwt::Role) -> crate::types::Result<()> {
        let role_str = role.to_string(); // Assuming Role implements Display trait
        sqlx::query!(
            "INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)",
            username, password_hash, role_str
        )
            .execute(&self.db).await?;

        Ok(())
    }

    async fn insert_game(&self, admin_id: Id, name: &str) -> crate::types::Result<()> {
        sqlx::query!(
            "INSERT INTO Games (name, admin_id) VALUES (?, ?)",
            name, admin_id
        )
            .execute(&self.db).await?;

        Ok(())
    }

    async fn insert_key(&self, game_id: Id, user_id: Id, key: &str) -> crate::types::Result<()> {
        sqlx::query!(
            "INSERT INTO Keys (game_id, user_id, private_key) VALUES (?, ?, ?)",
            game_id, user_id, key
        )
            .execute(&self.db).await?;

        Ok(())
    }
}