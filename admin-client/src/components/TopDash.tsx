import { SidebarTrigger } from '@/components/ui/sidebar';
import { BellRing } from 'lucide-react';
import { WalletConnect } from './wallet-connect/WalletConnect';
import { useEffect } from 'react';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth';

const TopDash = () => {
    const { authData } = useCustomerAuthStore();
    useEffect(() => {
        if (authData.status === 'authenticated') {
        }
        return () => {};
    }, [authData.status]);

    return (
        <div className="flex flex-col text-white">
            {/* Top Navigation */}
            <nav className="w-full py-4">
                <div className="max-w-[1280px] flex items-center justify-between mx-4 ">
                    <SidebarTrigger className="ml-2" />

                    <div className="flex self-center">
                        <div className="flex justify-center items-center h-[50px] w-[50px] rounded-full bg-[#121212]">
                            <BellRing size={'24px'} />
                        </div>
                        <div className="h-[44px] border-l-[1px] self-center border-white mx-4" />
                        <div className="self-center">
                            <WalletConnect />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default TopDash;
