import HamzaLogo from '../../../public/Hamza-logo.svg';
import { WalletConnect } from '@/components/wallet-connect/WalletConnect';

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen  text-white">
            {/* Top Navigation */}
            <nav className="w-full py-4">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4">
                    <img src={HamzaLogo} />
                    <WalletConnect />
                </div>
            </nav>

            {/* Main Content */}

            <div className="flex flex-col max-w-[1280px] w-[100%] mx-auto ">
                <div className="flex flex-col max-w-[553px] gap-8 mt-40 ">
                    <h1 className="text-7xl font-bold text-left leading-[80px]">
                        Sell Your Products{' '}
                        <span className="text-green-500">with Ease</span> on
                        Hamza
                    </h1>
                    <p className="text-2xl text-gray-300 text-left pr-20">
                        Reach more customers and grow your business today.
                    </p>
                    <WalletConnect />
                </div>
            </div>
        </div>
    );
}
