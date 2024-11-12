import { Outlet } from '@tanstack/react-router';
import TopDash from '@/components/TopDash';

const RootComponent = () => {
    return (
        <div>
            <TopDash />
            <Outlet />
        </div>
    );
};

export default RootComponent;
