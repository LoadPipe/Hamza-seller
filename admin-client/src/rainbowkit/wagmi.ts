import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    sepolia,
    optimism,
    polygonAmoy,
    base,
    polygon,
    arbitrum,
    mainnet,
} from 'wagmi/chains';
import { _chains } from 'node_modules/@rainbow-me/rainbowkit/dist/config/getDefaultConfig';
import { RainbowKitChain } from 'node_modules/@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitChainContext';

let wagmiChains: RainbowKitChain[] = [];

let allowedChains = (import.meta.env.VITE_ALLOWED_BLOCKCHAINS ?? '').split(',');

if (allowedChains.length === 0 || allowedChains[0] === '') {
    allowedChains = ['sepolia'];
}

const chainConfig: Record<string | number, RainbowKitChain> = {
    optimism: optimism,
    10: optimism,
    polygon: polygon,
    137: polygon,
    mainnet: mainnet,
    1: mainnet,
    sepolia: sepolia,
    11155111: sepolia,
    polygonAmoy: polygonAmoy,
    80002: polygonAmoy,
    base: base,
    8453: base,
    arbitrum: arbitrum,
    42161: arbitrum,
};

// Populate wagmiChains based on allowedChains
wagmiChains = allowedChains
    .map((c: any) => chainConfig[c as keyof typeof chainConfig])
    .filter(Boolean) as RainbowKitChain[]; // Remove undefined values

// Ensure wagmiChains has at least one item before assigning it to wagmiChains2
if (wagmiChains.length === 0) {
    throw new Error(
        'wagmiChains is empty; at least one chain is required for _chains.'
    );
}

let allowedWagmiChains: _chains = [wagmiChains[0], ...wagmiChains.slice(1)];

export const config = getDefaultConfig({
    appName: 'My RainbowKit App', //TODO: change these defaults
    projectId: 'YOUR_PROJECT_ID',
    chains: allowedWagmiChains,
    ssr: true,
});
