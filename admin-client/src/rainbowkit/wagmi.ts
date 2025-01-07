import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { optimism, sepolia, mainnet, polygonAmoy } from 'wagmi/chains';

const allowedChains =
    import.meta.env.VITE_INCLUDE_SEPOLIA === 'true' ? sepolia : optimism;

console.log(import.meta.env.VITE_INCLUDE_SEPOLIA);
console.log('ALLOWED CHAINS:', allowedChains);

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [sepolia, optimism, mainnet, polygonAmoy],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
