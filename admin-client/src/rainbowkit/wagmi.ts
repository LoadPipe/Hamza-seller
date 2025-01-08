import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, polygonAmoy } from 'wagmi/chains';

const allowedChains =
    import.meta.env.VITE_INCLUDE_SEPOLIA === 'true' ? sepolia : optimism;

console.log(import.meta.env.VITE_INCLUDE_SEPOLIA);
console.log('ALLOWED CHAINS:', allowedChains);

export const config = getDefaultConfig({
    appName: 'My RainbowKit App', //TODO: change these defaults
    projectId: 'YOUR_PROJECT_ID',
    chains: [sepolia, polygonAmoy],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
