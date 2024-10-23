import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';


const CardShowcase = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: item.image_url }} style={[styles.image]} />
            <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
    );
};




const styles = StyleSheet.create({
    card: {
        width: 150,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        margin: 5,
    },
    image: {
        width: 125,
        height: 175,
        borderRadius: 12,
    },
    text: {
        marginTop: 5,
    },
});

export default CardShowcase;
