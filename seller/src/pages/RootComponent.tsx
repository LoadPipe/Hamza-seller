import { Outlet } from '@tanstack/react-router';
import TopDash from '@/components/TopDash';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

const RootComponent = () => {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col w-full">
                    <TopDash />
                    <Outlet />
                </div>
                <TanStackRouterDevtools initialIsOpen={false} />
            </SidebarProvider>
        </div>
    );
};

export default RootComponent;
