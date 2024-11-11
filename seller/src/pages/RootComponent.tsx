import React from 'react';
import { Outlet } from '@tanstack/react-router';

const RootComponent = () => {
    return (
        <div>
            <h1 className='ml-4 hover:text-red-500 text-blue-500'>Hamza seller</h1>
            <Outlet />
        </div>
    );
};

export default RootComponent;
