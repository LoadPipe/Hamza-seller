import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    sepolia,
    optimism,
    polygonAmoy,
    base,
    polygon,
    arbitrum,
    bsc,
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'My RainbowKit App', //TODO: change these defaults
    projectId: 'YOUR_PROJECT_ID',
    chains:
        import.meta.env.VITE_INCLUDE_SEPOLIA === 'true'
            ? [sepolia, polygonAmoy]
            : [sepolia, optimism, base, polygon, arbitrum, bsc],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
