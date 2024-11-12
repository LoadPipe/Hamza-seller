import React from 'react';
import { Outlet } from '@tanstack/react-router';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { CgBell } from 'react-icons/cg';

const RootComponent = () => {
    return (
        <div>
            <div className="flex items-center bg-black h-[56px]">
                <SidebarTrigger className="ml-2" />

                <div className="flex  ml-auto">
                    <div className="flex justify-center items-center h-[56px] w-[56px] rounded-full bg-[#121212]">
                        <CgBell size={'24px'} />
                    </div>

                    <div className="h-[56px] border-l-[1px] border-white mx-4" />
                    {/* Login */}
                    <button className="flex justify-center items-center bg-[#121212] h-[56px] w-[190px]">
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
