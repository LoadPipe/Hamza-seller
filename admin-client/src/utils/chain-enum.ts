enum ChainNames {
    Mainnet = 1,
    Optimism = 10,
    Polygon = 137,
    Base = 8453,
    Arbitrum = 42161,
    Amoy = 80002,
    Sepolia = 11155111,
    OpSepolia = 11155420,
}

export const chainIdToName = (id: number): string => {
    if (typeof id !== 'number' || isNaN(id)) {
        console.warn(`Invalid chain ID: ${id}`);
        return 'Unknown Chain';
    }

    return (
        Object.entries(ChainNames).find(([, value]) => value === id)?.[0] ||
        'Unknown Chain'
    );
};

// Map chain IDs to their logos
export const getChainLogo = (id: number): string => {
    const logos: Record<number, string> = {
        1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029', // Ethereum Mainnet
        10: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=029', // Optimism
        137: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=029', // Polygon
        8453: 'https://www.base.org/_next/static/media/logo.f6fdedfc.svg', // Base
        42161: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=029', // Arbitrum
        11155111:
            'https://d2f70xi62kby8n.cloudfront.net/bridge/icons/networks/ethereum.svg?auto=compress%2Cformat', // Sepolia (fallback to Ethereum)
        11155420:
            'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=029', // OpSepolia (OP LOGO...)
        80002: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=029', // Amoy (fallback to Polygon)
    };

    return (
        logos[id] || 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029'
    ); // Default to Ethereum logo
};
