import React from 'react';
import SideMenu from './SideMenu';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <SideMenu />
            <div className="flex-1 p-4">
                {children}
            </div>
        </div>
    );
};

export default Layout;
