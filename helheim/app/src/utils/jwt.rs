use std::fmt::{Display, Formatter};
use std::str::FromStr;

use jsonwebtoken::{Algorithm, encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};

use crate::types::ClientId;

pub struct Jwt(pub String);

impl Display for Jwt {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}


#[derive(Debug, Clone, Deserialize, Serialize, Ord, PartialOrd, PartialEq, Eq)]
pub enum Role {
    Admin,
    GameDev,
}

impl std::str::FromStr for Role {
    type Err = anyhow::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "admin" => Ok(Role::Admin),
            "game_dev" => Ok(Role::GameDev),
            role => Err(anyhow::anyhow!("Unrecognized role: {role}"))
        }
    }
}

impl From<std::string::String> for Role {
    fn from(value: String) -> Self {
        Self::from_str(&value).unwrap()
    }
}

impl std::fmt::Display for Role {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Role::Admin => write!(f, "admin"),
            Role::GameDev => write!(f, "game_dev"),
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub nbf: usize,
    pub rol: crate::utils::jwt::Role,
}

pub fn generate_token(user_id: ClientId, shared_secret: &[u8], role: Role) -> crate::types::Result<Jwt> {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::try_hours(24).expect("Parsing static 24h should work"))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration as usize,
        nbf: chrono::Utc::now().timestamp() as usize,
        rol: role,
    };

    let header = Header::new(Algorithm::HS256);
    let encoding_key = EncodingKey::from_secret(shared_secret);
    let token = encode(&header, &claims, &encoding_key)?;
    Ok(Jwt(token))
}

pub fn validate_token(token: &Jwt, shared_secret: &[u8]) -> crate::types::Result<Claims> {
    let decoding_key = jsonwebtoken::DecodingKey::from_secret(shared_secret);
    let validation = jsonwebtoken::Validation::new(Algorithm::HS256);
    let token = jsonwebtoken::decode::<Claims>(&token.to_string(), &decoding_key, &validation)?;
    verify_claims(&token.claims)?;
    Ok(token.claims)
}

fn verify_claims(claims: &Claims) -> anyhow::Result<()> {
    if claims.exp < chrono::Utc::now().timestamp() as usize {
        return Err(anyhow::anyhow!("Token is expired."));
    }

    if claims.nbf > chrono::Utc::now().timestamp() as usize {
        return Err(anyhow::anyhow!("Token is not yet valid."));
    }

    Ok(())
}