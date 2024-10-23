pub type ClientId = String;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error(transparent)]
    JwtError(#[from] jsonwebtoken::errors::Error),
    #[error(transparent)]
    Anyhow(#[from] anyhow::Error),
    #[error(transparent)]
    Database(#[from] sqlx::Error),
    #[error("Argon error")]
    Argon,
}


pub type Result<T> = std::result::Result<T, Error>;