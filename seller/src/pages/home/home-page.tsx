import HamzaLogo from '../../../public/Hamza-logo.svg';
import { WalletConnect } from '@/components/wallet-connect/WalletConnect';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen text-white">
            {/* Top Navigation */}
            <nav className="w-full py-4">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between px-4">
                    <img src={HamzaLogo} />
                    <WalletConnect />
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col flex-1 items-center justify-center px-4">
                <div className="max-w-[1280px] mx-auto text-center space-y-4">
                    <h1 className="text-5xl font-bold">
                        Sell Your Products{' '}
                        <span className="text-green-500">with Ease</span> on
                        Hamza
                    </h1>
                    <p className="text-lg text-gray-300">
                        Reach more customers and grow your business today.
                    </p>
                </div>
            </div>
        </div>
    );
}
