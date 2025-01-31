import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    sepolia,
    optimism,
    polygonAmoy,
    base,
    polygon,
    arbitrum,
    mainnet,
    Chain,
} from 'wagmi/chains';
import { _chains } from 'node_modules/@rainbow-me/rainbowkit/dist/config/getDefaultConfig';
import { RainbowKitChain } from 'node_modules/@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitChainContext';

let wagmiChains: RainbowKitChain[] = [];

let allowedChains = (import.meta.env.VITE_ALLOWED_BLOCKCHAINS ?? '').split(',');

console.log('allowedChains', allowedChains);

// Ensure at least 'sepolia' is included if the env variable is empty
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
    .map((c) => chainConfig[c as keyof typeof chainConfig])
    .filter(Boolean) as RainbowKitChain[]; // Remove undefined values

console.log('wagmiChains', wagmiChains);

// Ensure wagmiChains has at least one item before assigning it to wagmiChains2
if (wagmiChains.length === 0) {
    throw new Error(
        'wagmiChains is empty; at least one chain is required for _chains.'
    );
}

// ✅ Now TypeScript knows wagmiChains has at least one item
let wagmiChains2: _chains = [wagmiChains[0], ...wagmiChains.slice(1)];

console.log('wagmiChains2', wagmiChains2);

export const config = getDefaultConfig({
    appName: 'My RainbowKit App', // TODO: Change these defaults
    projectId: 'YOUR_PROJECT_ID',
    chains: wagmiChains2,
    ssr: true, // If your dApp uses server-side rendering (SSR)
});
