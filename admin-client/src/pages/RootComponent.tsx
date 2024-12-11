import { Outlet } from '@tanstack/react-router';
import TopDash from '@/components/TopDash';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { OrderDetailsSidebar } from '@/components/orders/order-details-sidebar.tsx';
import { Toaster } from '@/components/ui/toaster';

const RootComponent = () => {
    return (
        <div>
            {/* Separate Provider for App Sidebar */}
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-grow">
                    <TopDash />
                    <Outlet />
                </div>
            </SidebarProvider>
            {/* Separate Provider for Order Details Sidebar */}
            <SidebarProvider>
                <OrderDetailsSidebar />
            </SidebarProvider>
            <TanStackRouterDevtools initialIsOpen={false} />
            <Toaster />
        </div>
    );
};

export default RootComponent;
