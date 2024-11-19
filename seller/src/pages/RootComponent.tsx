import { Outlet, useRouter } from '@tanstack/react-router';
import TopDash from '@/components/TopDash';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { OrderDetailsSidebar } from '@/components/orders/order-details-sidebar.tsx';

const RootComponent = () => {
    const router = useRouter();

    // Determine if the current route is the home page
    const isHomePage = router.state.location.pathname === '/';

    return (
        <div>
            {/* Separate Provider for App Sidebar */}
            <SidebarProvider>
                {!isHomePage && <AppSidebar />}
                <div className="flex flex-col w-full">
                    {!isHomePage && <TopDash />}
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
