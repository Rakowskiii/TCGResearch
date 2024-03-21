// -- POLYFILS

// -- END POLYFILS

import { React, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//Self
import CardShowcase from './CardShowcase';
import CardModal from './CardModal';
import QrScanner from './QrScanner';


import { contractAddress } from './config';








function CollectionComponent({ address }) {
  const [nfts, setNfts] = useState([]);
  const [next, setNext] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);


  const getNFTsForAccount = async (address, limit, nextPage) => {
    let url = `https://testnets-api.opensea.io/api/v2/chain/sepolia/account/${address}/nfts?limit=${limit}`;
    if (nextPage) {
      url += `&next=${nextPage}`;
    }
    let res = await fetch(url).then(res => res.json());
    return res
  };


  useEffect(() => {
    fetchNFTs(); // Fetch initial NFTs on component mount
  }, []);


  const fetchNFTs = async (nextPage = undefined) => {
    if (!loading) {
      setLoading(true);
      try {
        const response = await getNFTsForAccount(address, 100, nextPage);
        console.log(new Date(response.nfts[0].updated_at))
        console.log(new Date(Date.now() - 75 * 60000))
        console.log(new Date(response.nfts[0].updated_at) > new Date(Date.now() - 75 * 60000))
        resNfts = [...response.nfts].filter(nft => nft.contract == contractAddress.toLowerCase());//) && new Date(nft.updated_at) > new Date(Date.now() - 100 * 60000));
        // setNfts(prevNfts => [...prevNfts, ...resNfts]);
        setNfts(resNfts);
        // setNext(response.next); // Assuming the response has a 'next' property for pagination
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        // if (refreshing) {
        setRefreshing(false);
        // }
      }
    }
  };

  const handleLoadMore = () => {
    if (next && !loading) {
      fetchNFTs(next);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ color: '#000' }} />;
  };

  const onRefresh = () => {
    setRefreshing(true);
    setNfts([]);
    setNext(undefined);
    fetchNFTs();
  };

  if (!address) {
    return <View>
      <Text>Please connect your wallet</Text>
    </View>
  };


  return (
    <View>
      <FlatList
        data={nfts}
        keyExtractor={item => item.updated_at} // Assuming each NFT has a unique 'id' property
        renderItem={({ item }) => (
          <CardShowcase item={item}
            onPress={() => {
              setSelectedNFT(item);
              setIsModalVisible(true);
            }}
          />

        )}
        numColumns={2}
        ListFooterComponent={renderFooter}
        // onEndReached={handleLoadMore}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", top: 280 }}>
            <Text>Looks so empty here...</Text>
            <MaterialCommunityIcons name="ghost" size={100} color="grey" />
          </View>
        }
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* <Button onPress={handleLoadMore} title="Load more..." /> */}
      {selectedNFT && (
        <CardModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} item={selectedNFT} />
      )}

    </View>
  );
};


// Define your screens
function CollectionScreen() {
  // const { address, isConnected } = useAccount();

  return (
    <View style={styles.container}>
      {/*isConnected*/ true && <CollectionComponent address={/*address*/ "0x9bB895Fd05b9F088e2984781a2A7E4d75d9352E3"} />}
      <StatusBar style="auto" />
    </View>
  );
}

{/* <Button onPress={() => {
        console.log(getAccount().address)
        openseaSDK.api.getNFTsByAccount(getAccount().address, 10).then(NFTs => NFTs.nfts.filter(nft => nft.collection == "tcg-research-test-v3-2").forEach(nft => console.log(nft.name, nft.metadata_url, nft.image_url, nft.identifier))).catch(e => console.error("Error", e));
      }} title="Press me" /> */}

function ScannerScreen() {
  return (
    <View style={styles.container}>
      <QrScanner />
      <StatusBar style="auto" />
    </View>
  );
}

function ConfigScreen() {
  return (
    <View style={styles.container}>
      {/* <W3mButton /> */}
      <StatusBar style="auto" />
    </View>
  );
}

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();



export default function App() {


  return (
    <NavigationContainer>
      {/* <Web3Modal /> */}
      <Tab.Navigator>
        <Tab.Screen
          name="Collection"
          component={CollectionScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cards" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="barcode-scan" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="Config"
          component={ConfigScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            ),
          }}
        />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    // Modal styles
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    // Ensure the modal content container stretches but not beyond screen bounds
    maxWidth: '80%',
    maxHeight: '80%',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
});
