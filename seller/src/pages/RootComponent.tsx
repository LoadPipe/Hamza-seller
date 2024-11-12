import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { SidebarTrigger } from '@/components/ui/sidebar';

const RootComponent = () => {
    return (
        <div>
            <div className="flex items-center bg-black h-[56px]">
                <SidebarTrigger className="ml-2" />

                <div className="flex  ml-auto">
                    <div className="h-[56px] border-l-2 border-white mx-4" />

                    <button className="flex justify-center items-center h-[56px] w-[190px]">
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-semibold">John Doe</p>
                            <p className="text-sm">Admin</p>
                        </div>
                    </button>
                </div>
            </div>
            <Outlet />
        </div>
    );
};

export default RootComponent;
