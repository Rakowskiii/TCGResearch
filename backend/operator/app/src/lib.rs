use ethers::addressbook::{Address, Chain};
use ethers::prelude::*;
use lazy_static::lazy_static;
use sha3::Digest;
use sqlx::migrate::MigrateDatabase;
use tracing::info;

use crate::models::ContractClient;

mod appstate;
pub(crate) mod controllers;
pub(crate) mod extractors;
pub(crate) mod models;
pub(crate) mod routes;
pub mod types;
pub(crate) mod utils;

lazy_static! {
    pub static ref WALLET: String = std::env::var("HELHEIM_WALLET").unwrap();
    pub static ref CONTRACT: String = std::env::var("HELHEIM_CONTRACT_ADDRESS").unwrap();
    pub static ref DB_URL: String = std::env::var("HELHEIM_DB_URL").unwrap();
    pub static ref RPC_URL: String = std::env::var("HELHEIM_RPC_URL").unwrap();
    pub static ref SHARED_SECRET: [u8; 32] = {
        let shared_string = std::env::var("HELHEIM_SHARED_SECRET").unwrap();
        let mut hasher = sha3::Sha3_256::new();
        hasher.update(shared_string.as_bytes());
        hasher.finalize().into()
    };
}

pub async fn run() {
    // TODO: move this somewhere better
    // TODO: add migrations
    if !sqlx::Sqlite::database_exists(&*DB_URL)
        .await
        .unwrap_or(false)
    {
        info!("Creating database {}", &*DB_URL);
        match sqlx::Sqlite::create_database(&*DB_URL).await {
            Ok(_) => info!("Create db success"),
            Err(error) => panic!("error: {}", error),
        }
    } else {
        info!("Database already exists");
    }

    let wallet: LocalWallet = WALLET
        .parse::<LocalWallet>()
        .expect("Invalid private key")
        .with_chain_id(Chain::Optimism);

    let contract_address = CONTRACT.parse::<Address>().unwrap();

    let app_state = appstate::AppState {
        client: crate::models::utgard::UtgardClient::new(wallet, contract_address, &*RPC_URL),
        db: sqlx::SqlitePool::connect(&*DB_URL).await.unwrap(),
        shared_secret: *SHARED_SECRET,
    };

    let app = axum::Router::new()
        .route(
            "/register_game",
            axum::routing::post(crate::routes::register_game::handler),
        )
        .route(
            "/register_collection",
            axum::routing::post(crate::routes::register_collection::handler),
        )
        .route(
            "/register",
            axum::routing::post(crate::routes::register_user::handler),
        )
        .route("/login", axum::routing::get(crate::routes::login::handler))
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:9090").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
