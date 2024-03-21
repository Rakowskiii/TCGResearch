// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {Cards} from "../src/Cards.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

contract CardsTest is Test {
    Cards public cards;

    function test_setUp() public {
        address public_key = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        cards = new Cards(public_key);
        uint256 token = 0x1559ae4021aaca96dbfcfcc4eb4ee63d188dcc37ed387e13b85c32d84dea261;
        uint256 token_id = 603563865116272733381594758861483729960669020351706880164860692350304690785;
        assertEq(uint256(token), token_id);

        bytes
            memory sig = hex"b8c808ad5e13a108f1ba0bd3bbe50d5c19a4a9d0efb744400145c2e5ae0537ca6c461d3a184a50e92623b12f307060929bd1f26f99d318deb31b0da5e8293b441c";

        bytes memory data = abi.encodePacked(token, uint256(2), bytes32(0));
        bytes
            memory rustData = hex"01559ae4021aaca96dbfcfcc4eb4ee63d188dcc37ed387e13b85c32d84dea26100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000";

        assertEq(data, rustData);
        bytes32 _preHash = keccak256(data);
        assertEq(
            _preHash,
            0xd39bd1e2f35ddbd3a16cfc81191e2d785607636818a493a383f5bd01e9e0c3ad
        );

        bytes32 _hash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _preHash)
        );

        bytes32 rustHash = 0x760fe848b2468e940a0a2ba1788eeb4dec42d3bc02c5b0373c0b499716f190dc;
        assertEq(_hash, rustHash);

        address signer = ECDSA.recover(_hash, sig);
        assertEq(signer, public_key);
        // booster = BoosterPack({
        //     ids: [token],
        //     amounts: [1],
        //     nonce: bytes32(0),
        //     signature: bytes("")
        // });

        // ECDSA.recover(
        //     abi.encodePacked(booster.ids, booster.amounts, booster.nonce),
        //     bytes("")
        // );
    }

    // function test_Increment() public {
    //     counter.increment();
    //     assertEq(counter.number(), 1);
    // }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
