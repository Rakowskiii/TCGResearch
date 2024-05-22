// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// TODO: Add submodules to git
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Cards is ERC1155, AccessControl, ERC1155Supply {
    event NonceUsed(bytes32 nonce);

    // Keep track of minted nonces for each game
    mapping(uint32 => mapping(bytes32 => bool)) public mintedNonces;

    // Keep track of base URI for each collection for each game
    mapping(uint32 => mapping(uint80 => string)) private _collectionURIs;

    // Describe a booster pack
    // TODO: chain id, signatures multiple
    struct BoosterPack {
        uint256[] ids;
        bytes32 nonce;
        bytes signature;
    }

    constructor(address defaultAdmin) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    }

    function registerMinterRole(uint32 gameId, address minter) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "ERC1155: must have admin role to register minter role"
        );
        bytes32 role = keccak256(abi.encodePacked("MINTER_ROLE", gameId));
        _grantRole(role, minter);
    }

    function claimBooster(
        BoosterPack calldata boosterPack,
        bool[] memory wantPrinted
    ) public payable {
        bytes32 hash = keccak256(
            abi.encodePacked(
                boosterPack.ids,
                boosterPack.nonce,
                // chainid(),
                address(this)
            )
        );

        hash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );

        address signer = ECDSA.recover(hash, boosterPack.signature);
        uint32 gameId = _getGameId(boosterPack.ids[0]);
        bytes32 role = keccak256(abi.encodePacked("MINTER_ROLE", gameId));

        require(
            hasRole(role, signer),
            "ERC1155: Some cards were not signed by valid minter for this game."
        );

        for (uint8 i = 0; i < boosterPack.ids.length; i++) {
            require(
                gameId == _getGameId(boosterPack.ids[i]),
                "ERC1155: ids are from different games"
            );
        }

        uint256[] memory amounts = new uint256[](wantPrinted.length);
        for (uint8 i = 0; i < wantPrinted.length; i++) {
            amounts[i] = wantPrinted[i] ? 1 : 0;
        }

        require(
            !mintedNonces[gameId][boosterPack.nonce],
            "ERC1155: minting already used nonce"
        );
        require(
            boosterPack.ids.length == wantPrinted.length,
            "ERC1155: ids and wishlist length mismatch"
        );

        mintedNonces[gameId][boosterPack.nonce] = true;
        _mintBatch(msg.sender, boosterPack.ids, amounts, "");
        emit NonceUsed(boosterPack.nonce);
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function uri(
        uint256 _tokenID
    ) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _collectionURIs[_getGameId(_tokenID)][
                        _getCollection(_tokenID)
                    ],
                    Strings.toString(_getCardId(_tokenID))
                )
            );
    }

    function _getGameId(uint256 id) internal pure returns (uint32) {
        return uint32(id >> 224);
    }

    function _getCollection(uint256 _tokenID) internal pure returns (uint80) {
        return uint80(_tokenID >> 144);
    }

    function _getCardRarity(uint256 _tokenID) internal pure returns (uint16) {
        return uint16(_tokenID >> 128);
    }

    function _getCardId(uint256 _tokenID) internal pure returns (uint128) {
        return uint128(_tokenID);
    }

    function registerCollection(
        uint32 gameId,
        uint80 collection,
        string memory collectionCID
    ) public {
        bytes32 role = keccak256(abi.encodePacked("MINTER_ROLE", gameId));
        require(
            hasRole(role, msg.sender),
            "ERC1155: must have admin role to register collection"
        );
        // Set collectionsURIs[collection] to ipfs://<collectionCID>/\{id\}
        _collectionURIs[gameId][collection] = string(
            abi.encodePacked("ipfs://", collectionCID, "/")
        );
    }

    // Opensea related stuff
    function contractURI() public pure returns (string memory) {
        string
            memory json = '{"name": "TCG Research - v4", "description": "Research around using erc-1155 multitoken standard to fix multiple problems TCG players are facing.","image": "https://cards.rakowskiii.com/assets/collection.jpg","external_link": "https://cards.rakowskiii.com/","collaborators": []}';
        return string.concat("data:application/json;utf8,", json);
    }
}

// function _uint2hexstr(uint256 i) public pure returns (string memory) {
//     if (i == 0) return "0";
//     uint j = i;
//     uint length;
//     while (j != 0) {
//         length++;
//         j = j >> 4;
//     }
//     uint mask = 15;
//     bytes memory bstr = new bytes(length);
//     uint k = length;
//     while (i != 0) {
//         uint curr = (i & mask);
//         bstr[--k] = curr > 9
//             ? bytes1(uint8(55 + curr))
//             : bytes1(uint8(48 + curr)); // 55 = 65 - 10
//         i = i >> 4;
//     }
//     return string(bstr);
// }

// function uri(
//     uint256 _tokenID
// ) public pure override returns (string memory) {
//     string memory hexstringtokenID = _uint2hexstr(_tokenID);

//     return string(abi.encodePacked("ipfs://f0", hexstringtokenID));
// }

// //function to view all mintedNonces
// function viewMintedNonces()
//     public
//     view
//     returns (mapping(bytes32 => bool) memory)
// {
//     return mintedNonces;
// }

//  function _setURI(uint256 _tokenID, string memory _tokenURI) internal {
//      _tokenURIs[_tokenID] = _tokenURI;
//  }

//This function will take collection id (uint48) and

//  function batchRegisterToken(uint256[] memory _tokenIDs, string[] memory _tokenURIs) public {
//      require(hasRole(MINTER_ROLE, msg.sender), "ERC1155: must have minter role to register tokens");
//      require(_tokenIDs.length == _tokenURIs.length, "ERC1155: ids and uris length mismatch");
//      for (uint256 i = 0; i < _tokenIDs.length; i++) {
//          _setURI(_tokenIDs[i], _tokenURIs[i]);
//      }
//  }

// uint256 id = ids[i];
// // Check against gameId
// uint256 amount = amounts[i];
// uint256 index = 0;
// for (uint256 j = 0; j < boosterPack.ids.length; j++) {
//     if (boosterPack.ids[j] == id) {
//         index = j;
//         break;
//     }
// }
// require(
//     boosterPack.amounts[index] >= amount,
//     "ERC1155: not enough cards in booster pack"
// );

// function mint(
//     address account,
//     uint256 id,
//     uint256 amount,
//     bytes memory data
// ) public onlyRole(MINTER_ROLE) {
//     _mint(account, id, amount, data);
// }

// // TODO: Remove this function for production
// function mintBatch(
//     address to,
//     uint256[] memory ids,
//     uint256[] memory amounts,
//     bytes memory data
// ) public onlyRole(MINTER_ROLE) {
//     _mintBatch(to, ids, amounts, data);
// }

//TODO: Remove this
// function getCardId(uint256 _tokenID) public pure returns (uint128) {
//     return _getCardId(_tokenID);
// }

//TODO: Require minter role

// function viewRole(uint32 gameId) public pure returns (bytes32) {
//     return keccak256(abi.encodePacked("MINTER_ROLE", gameId));
// }

// function getSigner(bytes32 hash, bytes memory signature) public pure returns (address) {
//     return ECDSA.recover(hash, signature);
// }

// PART     CHARACTERS     BITS     RESULT
// CardID       32          128     0x00112233445566778899AABBCCDDEEFF

//TODO: Remove this
// function  getCollection(uint256 _tokenID) public pure returns (uint80) {
//     return _getCollection(_tokenID);
// }

// PART     CHARACTERS     BITS     RESULT
// RARITY       4           16      0xEEFF
// function getCardRarity(uint256 _tokenID) public pure returns (uint16) {
//     return _getCardRarity(_tokenID);
// }
// function getGameId(uint256 id) public pure returns (uint32) {
//     return _getGameId(id);
// }

// PART     CHARACTERS     BITS     RESULT
// COLLECTION   20          80      0x445566778899AABBCCDD

/// 0x00112233445566778899AABBCCDDEEFF00112233445566778899AABBCCDDEEFF
// PART     CHARACTERS     BITS     RESULT
// GAME_ID      8           32      0x00112233
// COLLECTION   20          80      0x445566778899AABBCCDD
// RARITY       4           16      0xEEFF
// CardID       32          128     0x00112233445566778899AABBCCDDEEFF

// PART     CHARACTERS     BITS     RESULT
// GAME_ID      8           32      0x00112233
