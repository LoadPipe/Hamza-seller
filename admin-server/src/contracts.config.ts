interface Currency {
    contract_address: string;
    precision: number;
}

const chainConfig: any = {
    11155111: {
        chain_name: 'sepolia',
        dao: {
            address: '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A',
        },
    },
    80002: {
        chain_name: 'amoy',
        escrow_multicall: {
            address: '0xa8866FF28D26cdf312e5C902e8BFDbCf663a36ce',
        },
    },
    11155420: {
        chain_name: 'op-sepolia',
    },
    1: {
        chain_name: 'mainnet',
    },
    10: {
        chain_name: 'optimism',
        hns: {
            address: '0xDDa56f06D80f3D8E3E35159701A63753f39c3BCB',
        },
    },
    8453: {
        chain_name: 'base',
        escrow_multicall: {
            address: '0x801c4C568DBfB540De91e6DD95b31d252765F7F8',
        },
    },
    137: {
        chain_name: 'polygon',
        escrow_multicall: {
            address: '0xC4FaeAD225C62e5488dfE2dDD098A205c2f38759',
        },
    },
    42161: {
        chain_name: 'arbitrum',
        escrow_multicall: {
            address: '0xaAa8a4393e72292043978a2EAa5A7061DfA3b413',
        },
    },
};

const getContractAddress = (contractId: string, chainId: number = 1) =>
    chainConfig[chainId]
        ? (chainConfig[chainId][contractId]?.address ?? '')
        : '';

const getMasterSwitchAddress = (chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId]?.master_switch?.address
        : undefined;

const getMassmarketPaymentAddress = (chainId: number = 1) =>
    chainConfig[chainId]
        ? chainConfig[chainId]?.massmarket_payment?.address
        : undefined;

export {
    getContractAddress,
    getMasterSwitchAddress,
    getMassmarketPaymentAddress,
};
