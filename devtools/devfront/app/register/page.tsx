"use client"
import React, { useState } from 'react';
import Head from 'next/head';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        game_name: '',
        website: '',
        admin_address: '',
        email_admin: '',
        email_user: '',
        description: '',
    });
    const [successMessageVisible, setSuccessMessageVisible] = useState(false);
    const [errorMessageVisible, setErrorMessageVisible] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch('http://127.0.0.1:8080/register_game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.ok) {
                    setSuccessMessageVisible(true);
                    setErrorMessageVisible(false);
                } else {
                    setErrorMessageVisible(true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setErrorMessageVisible(true);
            });
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen relative">
            {/* <Head>
                <title>TCG Research</title>
                <link
                    href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
                    rel="stylesheet"
                />
            </Head> */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register Game</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="game_name" className="block text-sm font-medium text-gray-700">
                            Game name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="game_name"
                            id="game_name"
                            required
                            value={formData.game_name}
                            onChange={handleChange}
                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <span className="text-sm text-gray-500">Enter the name of your game.</span>
                    </div>
                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                            Game website <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="website"
                            id="website"
                            required
                            value={formData.website}
                            onChange={handleChange}
                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <span className="text-sm text-gray-500">Enter the URL of your game's website.</span>
                    </div>
                    <div>
                        <label htmlFor="admin_address" className="block text-sm font-medium text-gray-700">
                            Ethereum address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="admin_address"
                            id="admin_address"
                            value={process.env.NEXT_PUBLIC_ETH_PUBKEY}
                            readOnly
                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <span className="text-sm text-gray-500">Ethereum address of approved booster signer.</span>
                    </div>
                    <div>
                        <label htmlFor="email_admin" className="block text-sm font-medium text-gray-700">
                            Business contact <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email_admin"
                            id="email_admin"
                            required
                            value={formData.email_admin}
                            onChange={handleChange}
                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <span className="text-sm text-gray-500">Enter the business contact email.</span>
                    </div>
                    <div>
                        <label htmlFor="email_user" className="block text-sm font-medium text-gray-700">
                            User contact <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email_user"
                            id="email_user"
                            required
                            value={formData.email_user}
                            onChange={handleChange}
                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <span className="text-sm text-gray-500">Enter the user contact email.</span>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Short description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={4}
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                        <span className="text-sm text-gray-500">Provide a short description of your game.</span>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register game
                        </button>
                    </div>
                </form>
                {successMessageVisible && (
                    <div className="mt-4 p-4 text-green-700 bg-green-100 rounded-md">
                        Thank you! Our team will reach out to the provided business contact email within the next 14 days.
                    </div>
                )}
                {errorMessageVisible && (
                    <div className="mt-4 p-4 text-red-700 bg-red-100 rounded-md">
                        An error occurred while registering the game. Please try again.
                    </div>
                )}
            </div>
            {/* TODO: think about this real hard */}
            {/* <div className="info-box bg-gray-100 p-4 rounded-lg border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Already Registered?</h2>
                <p className="text-sm text-gray-600">
                    If you already have a game registered, get started with our collection of reference implementations:
                </p>
                <a href="https://github.com/your-repo-link" className="text-indigo-600 hover:underline mt-2 inline-block">
                    Visit our GitHub page
                </a>
            </div> */}
        </div>
    );
};

export default RegisterPage;
