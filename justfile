run-remmix:
 remixd -s contracts/utgard -u https://remix.ethereum.org

bind:
 forge bind --bindings-path ./helheim/bindings --root ./contracts/utgard --crate-name bindings --overwrite

abigen:
 cd contracts/utgard && forge build && cp ./out/Cards.sol/Cards.json ../../midgard/Cards.json 
