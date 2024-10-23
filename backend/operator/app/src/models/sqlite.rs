use crate::models::database::User;

#[axum::async_trait]
impl crate::models::database::Database for crate::appstate::AppState {
    async fn get_user(&self, username: &str) -> crate::types::Result<User> {
        let user = sqlx::query_as!(User, "SELECT * FROM Users WHERE username = ?", username)
            .fetch_one(&self.db)
            .await?;

        Ok(user)
    }

    async fn insert_user(
        &self,
        username: &str,
        password_hash: &str,
        mail: &str,
        role: crate::utils::jwt::Role,
    ) -> crate::types::Result<()> {
        let role_str = role.to_string();
        sqlx::query!(
            "INSERT INTO Users (username, password_hash, mail, role) VALUES (?, ?, ?, ?)",
            username,
            password_hash,
            mail,
            role_str
        )
        .execute(&self.db)
        .await?;

        Ok(())
    }
}
