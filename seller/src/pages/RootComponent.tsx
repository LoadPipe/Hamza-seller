import { Outlet } from '@tanstack/react-router';
import TopDash from '@/components/TopDash';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const RootComponent = () => {
    return (
        <div>
            <TopDash />
            <Outlet />
            <TanStackRouterDevtools initialIsOpen={false} />
        </div>
    );
};

export default RootComponent;
