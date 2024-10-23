import React from 'react';
import Link from 'next/link';

const SideMenu = () => {
    return (
        <div className="h-screen w-64 bg-gray-800 text-white p-4">
            <h2 className="text-2xl font-bold mb-6">Menu</h2>
            <ul>
                <li className="mb-4">
                    <Link href="/collections">
                        <p className="hover:text-gray-400">Collections</p>
                    </Link>
                    <ul className="ml-4 mt-2">
                        <li>
                            <Link href="/collections/create">
                                <p className="hover:text-gray-400">Create</p>
                            </Link>
                        </li>
                        <li>
                            <Link href="/collections/list">
                                <p className="hover:text-gray-400">List</p>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link href="/register">
                        <p className="hover:text-gray-400">Register Form</p>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideMenu;
