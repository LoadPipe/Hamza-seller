import { Outlet } from '@tanstack/react-router';
import TopDash from '@/components/TopDash';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { OrderDetailsSidebar } from '@/components/orders/order-details-sidebar.tsx';
import React from 'react';

const RootComponent = () => {
    return (
        <div>
            {/* Separate Provider for App Sidebar */}
            <SidebarProvider>
                <AppSidebar />
            <div className="flex flex-col w-full">
                <TopDash />
                <Outlet />
            </div>
            </SidebarProvider>
            {/* Separate Provider for Order Details Sidebar */}
            <SidebarProvider>
                <OrderDetailsSidebar />
            </SidebarProvider>
            <TanStackRouterDevtools initialIsOpen={false} />
        </div>
    );
};

export default RootComponent;
