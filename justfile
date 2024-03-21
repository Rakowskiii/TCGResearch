run-remmix:
 remixd -s utgard -u https://remix.ethereum.org

bind:
 forge bind --bindings-path ./helheim/bindings --root ./utgard --crate-name bindings --overwrite

abigen:
 cd utgard && forge build && cp ./out/Cards.sol/Cards.json ../midgard/Cards.json 
