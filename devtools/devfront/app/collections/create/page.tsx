"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCollectionPage = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [jsonFiles, setJsonFiles] = useState<File[]>([]);
    const [imageCID, setImageCID] = useState<string | null>(null);
    const [jsonCID, setJsonCID] = useState<string | null>(null);

    const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };
    const shortenHash = (hash: string) => {
        return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
    };

    const handleDrop = (event: React.DragEvent, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.items)
            .map(item => item.webkitGetAsEntry())
            .filter(entry => entry && entry.isFile)
            .map(entry => new Promise<File>((resolve, reject) => {
                entry.file(resolve, reject);
            }));
        Promise.all(files).then((fileArray) => {
            setFiles(prevFiles => [...prevFiles, ...fileArray]);
        });
    };

    const handleFiles = (event: React.ChangeEvent<HTMLInputElement>, setFiles: React.Dispatch<React.SetStateAction<File[]>>) => {
        const files = Array.from(event.target.files || []);
        setFiles(prevFiles => [...prevFiles, ...files]);
    };

    const uploadDirectory = async (files: File[], directoryName: string) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file, `${directoryName}/${file.name}`);
        });

        const options = JSON.stringify({ cidVersion: 0 });
        formData.append('pinataOptions', options);

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${pinataJWT}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.json();
    };

    const updateJsonFiles = (jsonFiles: File[], imageCID: string) => {
        return jsonFiles.map(file => {
            return new Promise<File>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const content = JSON.parse(reader.result as string);
                    const fileName = file.name;
                    const imageName = `${fileName}.jpg`;
                    content.image = `ipfs://${imageCID}/${imageName}`;
                    const updatedFile = new File([JSON.stringify(content)], fileName);
                    resolve(updatedFile);
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
        });
    };

    const uploadFiles = async () => {
        try {
            toast.info('Uploading images...');
            const imageResponse = await uploadDirectory(imageFiles, 'images');
            const imageCID = imageResponse.IpfsHash;
            setImageCID(imageCID);
            toast.success('Images uploaded successfully!');

            toast.info('Updating JSON files...');
            const updatedJsonFiles = await Promise.all(updateJsonFiles(jsonFiles, imageCID));

            toast.info('Uploading JSON files...');
            const jsonResponse = await uploadDirectory(updatedJsonFiles, 'jsons');
            const jsonCID = jsonResponse.IpfsHash;
            setJsonCID(jsonCID);

            toast.success('JSON files uploaded successfully!');
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('Error uploading files. Please try again.');
        }
    };

    const copyToClipboard = (text: string, button: HTMLButtonElement) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Copied to clipboard');
            button.classList.add('bg-gray-500', 'text-white');
            button.classList.remove('bg-gray-700', 'hover:bg-gray-800');
        }).catch(err => {
            console.error('Error copying to clipboard: ', err);
            toast.error('Failed to copy to clipboard');
        });
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <Head>
                <title>Create Collection</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
            </Head>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Upload Files to IPFS via Pinata</h1>
                <div
                    id="dropAreaImages"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 mb-4"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, setImageFiles)}
                >
                    Drag & Drop Image Files Here
                    <ul className="mt-4 text-left text-gray-700">
                        {imageFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
                <input type="file" id="fileInputImages" multiple className="hidden" webkitdirectory="true" onChange={(e) => handleFiles(e, setImageFiles)} />
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => document.getElementById('fileInputImages')?.click()}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Select Image Directory
                    </button>
                </div>
                <div
                    id="dropAreaJsons"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 mb-4"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, setJsonFiles)}
                >
                    Drag & Drop JSON Files Here
                    <ul className="mt-4 text-left text-gray-700">
                        {jsonFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
                <input type="file" id="fileInputJsons" multiple className="hidden" webkitdirectory="true" onChange={(e) => handleFiles(e, setJsonFiles)} />
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => document.getElementById('fileInputJsons')?.click()}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Select JSON Directory
                    </button>
                    <button
                        onClick={uploadFiles}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                    >
                        Upload
                    </button>
                </div>
                {imageCID && (
                    <div className="mb-4 p-4 bg-gray-100 rounded border border-gray-300">
                        <span className="text-gray-800">Images: ipfs://{shortenHash(imageCID)}</span>
                        <button
                            onClick={(e) => copyToClipboard(`ipfs://${imageCID}`, e.currentTarget)}
                            className="bg-gray-700 text-white py-1 px-2 rounded hover:bg-gray-800 ml-4"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                                />
                            </svg>
                        </button>
                    </div>
                )}
                {jsonCID && (
                    <div className="mb-4 p-4 bg-gray-100 rounded border border-gray-300">
                        <span className="text-gray-800">JSONs: ipfs://{shortenHash(jsonCID)}</span>
                        <button
                            onClick={(e) => copyToClipboard(`ipfs://${jsonCID}`, e.currentTarget)}
                            className="bg-gray-700 text-white py-1 px-2 rounded hover:bg-gray-800 ml-4"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default CreateCollectionPage;
