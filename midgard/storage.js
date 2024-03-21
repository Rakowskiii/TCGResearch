import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ipfs_resolver = 'https://ipfs.io/ipfs/';
AsyncStorage.clear();

const storage = new Storage({
    // maximum capacity, default 1000 key-ids
    size: 1000,

    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage

    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: 1000 * 3600 * 24,

    enableCache: true,

    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
        async card(params) {
            let { id } = params;
            url = id.replace("ipfs://", ipfs_resolver);
            let card = await fetch(url);
            const json = await card.json();
            if (json && json.image) {
                storage.save({
                    key: 'card',
                    id,
                    data: json
                });

                let url = json.image.replace("ipfs://", ipfs_resolver);
                console.log(url);
                let img = await fetch(url);
                console.log(img.status)

                if (img.ok) {
                    img = await img.blob();
                    img = URL.createObjectURL(img);
                    storage.save({
                        key: 'img',
                        id,
                        data: img
                    });

                    return json;
                }
                throw new Error('Failed to fetch image');
            }
            throw new Error('Failed to fetch card');
        },
        async img(params) {
            let { id } = params;
            let res = await fetch(url);

            if (res.ok) {
                let blob = await res.blob();
                blob = URL.createObjectURL(blob);
                storage.save({
                    key: 'img',
                    id,
                    data: blob
                });
            } else {
                throw new Error('Failed to fetch image');
            }
            return blob;
        }
    }
});

export default storage;