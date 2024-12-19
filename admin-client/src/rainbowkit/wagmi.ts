import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { optimism, sepolia } from 'wagmi/chains';

const allowedChains =
    process.env.NEXT_PUBLIC_INCLUDE_SEPOLIA === 'true' ? sepolia : optimism;

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [allowedChains],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
