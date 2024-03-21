import React, { useState, useEffect } from 'react';
import { TextEncoder, TextDecoder } from "fastestsmallesttextencoderdecoder";
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import BoosterModal from './BoosterModal';
// import { getContract } from 'viem';
// import { sepolia } from 'viem/chains';
import { Buffer } from 'buffer';
import { abi } from './Cards.json'; // Your contract ABI
import { ethers } from 'ethers';
import { contractAddress } from './config';
import storage from './storage';



function QrScanner() {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [cards, setCards] = useState([]);

    const [decodedBoosterPack, setDecodedBoosterPack] = useState()

    const [scanned, setScanned] = useState(false);

    const provider = new ethers.providers.JsonRpcProvider('https://rpc.sepolia.org');
    // const provider = new ethers.providers.JsonRpcProvider('https://sepolia.optimism.io');
    // const provider = new ethers.providers.JsonRpcProvider('https://mainnet.optimism.io');
    const contract = new ethers.Contract(contractAddress, abi, provider);


    const parseBoosterPack = (uriEncoded) => {
        uriEncoded = uriEncoded.replace("tcg://", "");
        let [method, data] = uriEncoded.split(":");
        let decodedString = Buffer.from(data, 'base64').toString('utf-8');
        let blob = JSON.parse(decodedString);
        blob.ids = blob.ids.map((id) => BigInt(id));
        blob.nonce = "0x" + blob.nonce.map(byte => byte.toString(16).padStart(2, '0')).join('');

        setDecodedBoosterPack(blob);
        return blob;
    }



    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);

        let boosterPack = parseBoosterPack(data);

        for (const booster of boosterPack.ids) {
            let res = await contract.uri(booster);
            console.log(booster, res);
            storage.load({ key: "card", id: res }).then((card) => {
                console.log("The card", card);
                setCards((cards) => [...cards, { card, id: booster }]);
            })
        }

    };




    return (
        <View style={styles.container}>
            <BoosterModal
                boosterPack={decodedBoosterPack}
                cards={cards}
                visible={scanned}
                onClose={() => { setScanned(false); setCards([]) }}
            />

            {permission && <CameraView style={styles.camera} facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            >
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip {scanned ? "true" : "false"} Camera</Text>
                        {scanned ? <Button title="Refresh" onPress={() => setScanned(false)}></Button> : null}
                    </TouchableOpacity>
                </View>
            </CameraView>}
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 350,
        maxHeight: 350,
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: 10,
    },
    camera: {
        flex: 1,
        width: "auto",
        height: 200,
        borderRadius: 10,
    }
});

export default QrScanner;
