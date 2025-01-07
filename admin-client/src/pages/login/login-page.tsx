import HamzaLogo from '../../../public/Hamza-logo.svg';
import { WalletConnect } from '@/components/wallet-connect/WalletConnect';
import HomeBgImage from '../../../public/images/home_bg_image.webp';

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen  text-white">
            {/* Top Navigation */}
            <nav className="w-full py-[21px] ">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between px-[75px]">
                    <img src={HamzaLogo} alt="hamza-logo" />
                    <WalletConnect />
                </div>
            </nav>

            {/* Main Content */}

            <div
                className="flex flex-col max-w-[1440px] w-[100%] min-h-screen  justify-center mx-auto p-[75px]"
                style={{
                    backgroundImage: `url(${HomeBgImage})`, // Dynamically reference the imported image
                    backgroundSize: 'cover', // Ensures the image covers the entire div
                    backgroundPosition: 'center', // Centers the image
                    backgroundRepeat: 'no-repeat', // Prevents repeating
                }}
            >
                <div className="flex flex-col max-w-[553px] gap-2 ">
                    <h1 className="text-7xl font-bold text-left leading-[80px]">
                        Sell Your Products{' '}
                        <span className="text-green-500">with Ease</span> on
                        Hamza
                    </h1>
                    <p className="text-2xl text-gray-300 text-left pr-20 mb-3">
                        Reach more customers and grow your business today.
                    </p>
                    <WalletConnect />
                </div>
            </div>
        </div>
    );
}
