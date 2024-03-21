import React, { useState } from 'react';
import { Modal, StyleSheet, View, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import { contract } from './config';

const BoosterCard = ({ item, index, setCardsToMint }) => {
    // Fix item to be only card, we dont need id
    let { card } = item;
    let [localStyle, setLocalStyle] = useState({});
    let [pressed, setPressed] = useState(false);

    const onPress = () => {
        // Order matters here to avoid race condition
        // First update the state based on the previous state
        // Then update the state
        setLocalStyle(pressed ? {} : { backgroundColor: 'lightblue' });
        setCardsToMint((cards) => {
            let newCards = [...cards];
            newCards[index] = pressed ? 0n : 1n;
            return newCards;
        });
        setPressed(!pressed);
    }

    return (
        <TouchableOpacity style={[styles.card, localStyle]} onPress={onPress}>
            {console.log("The fuck", card)}
            {console.log("Replace", card)}
            <Image source={{ uri: card.image.replace("ipfs://", "https://ipfs.io/ipfs/") }} style={[styles.image]} />
            {/* <Image source={{ uri: card.image }} style={[styles.image]} /> */}
            <Text style={styles.text}>{card.name}</Text>
        </TouchableOpacity>
    );
};



const BoosterModal = ({ cards, boosterPack, visible, onClose }) => {
    // 7 is temp, fix it later to dynamic 
    let [cardsToMint, setCardsToMint] = useState(new Array(7).fill(false)); // Add state to keep track of selected cards

    const mint = () => {
        contract.claimBooster(boosterPack, cardsToMint, {
            gasLimit: 500000
        }).then((tx) => { console.log(tx) });
        onClose();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text>Booster Pack</Text>
                    <FlatList
                        horizontal={true}
                        data={cards}
                        renderItem={({ item, index }) => (
                            <BoosterCard
                                item={item}
                                index={index}
                                setCardsToMint={setCardsToMint}
                            />
                        )}
                        keyExtractor={item => item.id}
                    />
                    {/* <ScrollView>
                        {cards.map((card) => (
                            <CardShowcase key={card.id} item={card} onPress={() => { }} style={{ width: 62, height: 87 }} />
                        ))}
                    </ScrollView> */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.claimButton} onPress={mint}>
                            <Text>Claim</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', // Adjust based on your needs
    },
    closeButton: {
        backgroundColor: '#f44336',
        marginTop: 20,
        padding: 10,
        borderRadius: 12,
    },
    claimButton: {
        backgroundColor: '#4CAF50',
        marginTop: 20,
        padding: 10,
        borderRadius: 12,
    },
    card: {
        width: 143,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        margin: 5,
    },
    image: {
        width: 93,
        height: 131,
        borderRadius: 12,
    },
    text: {
        marginTop: 5,
        fontSize: 12,
        justifyContent: 'center',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row', // Arranges children in a horizontal line
        justifyContent: 'space-between', // Adjusts spacing between buttons
    },
});

export default BoosterModal;