import { SidebarTrigger } from '@/components/ui/sidebar';
import { BellRing } from 'lucide-react';
import { WalletConnect } from './wallet-connect/WalletConnect';
import { useEffect, useState } from 'react';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const TopDash = () => {
    const { authData } = useCustomerAuthStore();

    const {
        data: storeName,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['store', authData],
        queryFn: async () => {
            const url = `http://localhost:9000/seller/store/name?wallet_address=${authData.wallet_address}`;
            const response = await axios.get(url);
            console.log(response);
            return response.data;
        },
        enabled: !!authData.wallet_address, // Query only runs if wallet_address is truthy
    });

    console.log('store name', authData.wallet_address);

    return (
        <div className="flex flex-col text-white">
            {/* Top Navigation */}

            <nav className="w-full py-4">
                <div className="max-w-[1280px] flex items-center justify-between mx-4 ">
                    <SidebarTrigger className="ml-2" />

                    <div className="flex self-center gap-4">
                        <div className="flex justify-center items-center h-[50px] w-[50px] rounded-full bg-[#121212]">
                            <BellRing size={'24px'} />
                        </div>

                        <div className="h-[44px] border-l-[1px] self-center border-white mx-4" />
                        <div className="self-center">
                            <WalletConnect />
                        </div>
                        <h2 className="text-green-50 self-center">
                            {storeName}
                        </h2>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default TopDash;
