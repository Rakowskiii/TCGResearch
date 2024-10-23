use ethers::addressbook::{Address, Chain};
use ethers::prelude::*;

use bindings::cards::BoosterPack;

use crate::WALLET;

pub async fn controller(tokens: Vec<ethers::types::U256>, nonce: [u8; 32]) -> BoosterPack {
    let wallet: LocalWallet = WALLET
        .parse::<LocalWallet>()
        .unwrap()
        .with_chain_id(Chain::Optimism);

    let encoded_booster = ethers::abi::encode_packed(&[
        ethers::abi::Token::Array(
            tokens
                .clone()
                .into_iter()
                .map(|number| ethers::abi::Token::Uint(number))
                .collect(),
        ),
        ethers::abi::Token::Bytes(ethers::abi::Bytes::from(nonce)),
        ethers::abi::Token::Address(crate::CONTRACT.parse::<Address>().unwrap()),
    ])
    .unwrap();

    let booster_data = ethers::utils::keccak256(encoded_booster);

    let hash = ethers::utils::hash_message(booster_data);

    let signature = wallet.sign_hash(hash).unwrap();

    BoosterPack {
        ids: tokens,
        nonce,
        signature: Bytes::from(signature.to_vec()),
    }
}
