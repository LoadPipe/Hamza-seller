"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMassmarketPaymentAddress = exports.getMasterSwitchAddress = exports.getContractAddress = void 0;
const chainConfig = {
    11155111: {
        chain_name: 'sepolia',
        master_switch: {
            address: '0x74b7284836F753101bD683C3843e95813b381f18',
        },
        massmarket_payment: {
            address: '0x3d9DbbD22E4903274171ED3e94F674Bb52bCF015',
        },
        lite_switch: {
            //address: '0x08EdF664EB5617d7eCf4F1ec74Ee49d9e99Fbd5f'
            address: '0x1fFc6ba4FcdfC3Ca72a53c2b64db3807B4A5aec8',
        },
        dao: {
            address: '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A',
        },
    },
    11155420: {
        chain_name: 'op-sepolia',
        master_switch: {
            address: '0x4B36e6130b4931DCc5A64c4bca366790aAA068d1',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            address: '0x0',
        },
        dao: {
            address: '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A',
        },
    },
    1: {
        chain_name: 'mainnet',
        master_switch: {
            address: '',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            address: '0x0',
        },
        dao: {
            address: '0x20823791a73f283d20B1cde299E738D5783499d8',
        },
    },
    10: {
        chain_name: 'optimism',
        master_switch: {
            address: '',
        },
        massmarket_payment: {
            address: '0x0',
        },
        lite_switch: {
            //address: '0x5b691FFdc872eC40d63fe34f471e3Edb16dAE154'
            address: '0x49E5231A3aE4c4272257b87b944415CFD113D2c3',
        },
        dao: {
            address: '0x214bef460Fda073a328aD02371C48E69Bd13442B',
        },
        hns: {
            address: '0xDDa56f06D80f3D8E3E35159701A63753f39c3BCB',
        },
    },
};
const getContractAddress = (contractId, chainId = 1) => { var _a, _b; return chainConfig[chainId] ? (_b = (_a = chainConfig[chainId][contractId]) === null || _a === void 0 ? void 0 : _a.address) !== null && _b !== void 0 ? _b : '' : ''; };
exports.getContractAddress = getContractAddress;
const getMasterSwitchAddress = (chainId = 1) => {
    var _a, _b;
    return chainConfig[chainId]
        ? (_b = (_a = chainConfig[chainId]) === null || _a === void 0 ? void 0 : _a.master_switch) === null || _b === void 0 ? void 0 : _b.address
        : undefined;
};
exports.getMasterSwitchAddress = getMasterSwitchAddress;
const getMassmarketPaymentAddress = (chainId = 1) => {
    var _a, _b;
    return chainConfig[chainId]
        ? (_b = (_a = chainConfig[chainId]) === null || _a === void 0 ? void 0 : _a.massmarket_payment) === null || _b === void 0 ? void 0 : _b.address
        : undefined;
};
exports.getMassmarketPaymentAddress = getMassmarketPaymentAddress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhY3RzLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250cmFjdHMuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLE1BQU0sV0FBVyxHQUFRO0lBQ3JCLFFBQVEsRUFBRTtRQUNOLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLGFBQWEsRUFBRTtZQUNYLE9BQU8sRUFBRSw0Q0FBNEM7U0FDeEQ7UUFDRCxrQkFBa0IsRUFBRTtZQUNoQixPQUFPLEVBQUUsNENBQTRDO1NBQ3hEO1FBQ0QsV0FBVyxFQUFFO1lBQ1QsdURBQXVEO1lBQ3ZELE9BQU8sRUFBRSw0Q0FBNEM7U0FDeEQ7UUFDRCxHQUFHLEVBQUU7WUFDRCxPQUFPLEVBQUUsNENBQTRDO1NBQ3hEO0tBQ0o7SUFDRCxRQUFRLEVBQUU7UUFDTixVQUFVLEVBQUUsWUFBWTtRQUN4QixhQUFhLEVBQUU7WUFDWCxPQUFPLEVBQUUsNENBQTRDO1NBQ3hEO1FBQ0Qsa0JBQWtCLEVBQUU7WUFDaEIsT0FBTyxFQUFFLEtBQUs7U0FDakI7UUFDRCxXQUFXLEVBQUU7WUFDVCxPQUFPLEVBQUUsS0FBSztTQUNqQjtRQUNELEdBQUcsRUFBRTtZQUNELE9BQU8sRUFBRSw0Q0FBNEM7U0FDeEQ7S0FDSjtJQUNELENBQUMsRUFBRTtRQUNDLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLGFBQWEsRUFBRTtZQUNYLE9BQU8sRUFBRSxFQUFFO1NBQ2Q7UUFDRCxrQkFBa0IsRUFBRTtZQUNoQixPQUFPLEVBQUUsS0FBSztTQUNqQjtRQUNELFdBQVcsRUFBRTtZQUNULE9BQU8sRUFBRSxLQUFLO1NBQ2pCO1FBQ0QsR0FBRyxFQUFFO1lBQ0QsT0FBTyxFQUFFLDRDQUE0QztTQUN4RDtLQUNKO0lBQ0QsRUFBRSxFQUFFO1FBQ0EsVUFBVSxFQUFFLFVBQVU7UUFDdEIsYUFBYSxFQUFFO1lBQ1gsT0FBTyxFQUFFLEVBQUU7U0FDZDtRQUNELGtCQUFrQixFQUFFO1lBQ2hCLE9BQU8sRUFBRSxLQUFLO1NBQ2pCO1FBQ0QsV0FBVyxFQUFFO1lBQ1QsdURBQXVEO1lBQ3ZELE9BQU8sRUFBRSw0Q0FBNEM7U0FDeEQ7UUFDRCxHQUFHLEVBQUU7WUFDRCxPQUFPLEVBQUUsNENBQTRDO1NBQ3hEO1FBQ0QsR0FBRyxFQUFFO1lBQ0QsT0FBTyxFQUFFLDRDQUE0QztTQUN4RDtLQUNKO0NBQ0osQ0FBQztBQUVGLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxVQUFrQixFQUFFLFVBQWtCLENBQUMsRUFBRSxFQUFFLGVBQ25FLE9BQUEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFBLE1BQUEsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQywwQ0FBRSxPQUFPLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBLEVBQUEsQ0FBQztBQWE1RSxnREFBa0I7QUFYdEIsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLFVBQWtCLENBQUMsRUFBRSxFQUFFOztJQUNuRCxPQUFBLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDaEIsQ0FBQyxDQUFDLE1BQUEsTUFBQSxXQUFXLENBQUMsT0FBTyxDQUFDLDBDQUFFLGFBQWEsMENBQUUsT0FBTztRQUM5QyxDQUFDLENBQUMsU0FBUyxDQUFBO0NBQUEsQ0FBQztBQVNoQix3REFBc0I7QUFQMUIsTUFBTSwyQkFBMkIsR0FBRyxDQUFDLFVBQWtCLENBQUMsRUFBRSxFQUFFOztJQUN4RCxPQUFBLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDaEIsQ0FBQyxDQUFDLE1BQUEsTUFBQSxXQUFXLENBQUMsT0FBTyxDQUFDLDBDQUFFLGtCQUFrQiwwQ0FBRSxPQUFPO1FBQ25ELENBQUMsQ0FBQyxTQUFTLENBQUE7Q0FBQSxDQUFDO0FBS2hCLGtFQUEyQiJ9