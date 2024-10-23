import React from 'react';
import { Modal, View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { contract, selfAddress } from './config';

const CardModal = ({ visible, onClose, item }) => {

    const [address, setAddress] = useState('');

    const transfer = () => {
        contract.safeTransferFrom(selfAddress, address ? address : "0x000000000000000000000000000000000000dead", item.identifier, 1, "0x", { gasLimit: 90000 });

        onClose();
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalView}>
                <Text style={styles.text}>{item.name}</Text>
                <Image source={{ uri: item.image_url }} style={styles.image} onError={(error) => console.log('Image loading error:', error)} />
                <Text>{item.metadata_url}</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                    />
                    <TouchableOpacity onPress={transfer} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onClose} style={styles.button}>
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};



const styles = StyleSheet.create({
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
        marginTop: 100
    },
    image: {
        width: 250,
        height: 350,
        marginBottom: 15,
    },
    text: {
        marginBottom: 15,
        textAlign: "center"
    },
    metadata: {
        marginBottom: 15,
        textAlign: "center"
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "#2196F3"
    },
    inputContainer: {
        flexDirection: 'row',
        // marginBottom: 30,
        marginVertical: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        marginRight: 10,
        flex: 1, // Makes sure the input stretches to fill available space
        borderRadius: 5,
    },
    sendButton: {
        backgroundColor: "#2196F3",
        borderRadius: 5,
        padding: 10,
    }
});

export default CardModal;
