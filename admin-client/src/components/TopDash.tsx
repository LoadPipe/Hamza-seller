import { SidebarTrigger } from '@/components/ui/sidebar';
import { BellRing } from 'lucide-react';
import { WalletConnect } from './wallet-connect/WalletConnect';
import { useQuery } from '@tanstack/react-query';
import { getSecure } from '@/utils/api-calls';
import { getJwtStoreId } from '@/utils/authentication';
import { useCustomerAuthStore } from '@/stores/authentication/customer-auth';
import { useEffect } from 'react';

const TopDash = () => {
    const { setCustomerPreferredCurrency } = useCustomerAuthStore();
    const store_id = getJwtStoreId();
    const { data: storeName } = useQuery({
        queryKey: ['store', store_id],
        queryFn: async () => {
            return await getSecure('/seller/store/name', {
                store_id: store_id,
            });
        },
        enabled: !!store_id,
    });

    const store_id2 = getJwtStoreId();
    const { data: storeCurrency } = useQuery({
        queryKey: ['store-currency', store_id2],
        queryFn: async () => {
            return await getSecure('/seller/store/default-currency', {
                store_id: store_id2,
            });
        },
        enabled: !!store_id2,
    });

    useEffect(() => {
        if (storeCurrency) {
            setCustomerPreferredCurrency(storeCurrency);
        }
    }, [storeCurrency, setCustomerPreferredCurrency]);

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
