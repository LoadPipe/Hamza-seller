"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyAddress = void 0;
exports.getCurrencyPrecision = getCurrencyPrecision;
const chainConfig = {
    11155111: {
        chain_name: 'sepolia',
        usdc: {
            contract_address: '0x822585D682B973e4b1B47C0311f162b29586DD02', //'0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
            precision: {
                display: 2,
                db: 2,
                native: 12,
            },
        },
        usdt: {
            contract_address: '0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                display: 5,
                db: 8,
                native: 18,
            },
        },
    },
    11155420: {
        chain_name: 'op-sepolia',
        usdc: {
            contract_address: '0x45B24160Da2cA92673B6CAf4dFD11f60aDac73E3',
            precision: {
                display: 2,
                db: 2,
                native: 12,
            },
        },
        usdt: {
            contract_address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                display: 5,
                db: 8,
                native: 18,
            },
        },
    },
    1: {
        chain_name: 'mainnet',
        usdc: {
            contract_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        usdt: {
            contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                display: 5,
                db: 8,
                native: 18,
            },
        },
    },
    10: {
        chain_name: 'optimism',
        usdc: {
            contract_address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        usdt: {
            contract_address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
            precision: {
                display: 2,
                db: 2,
                native: 6,
            },
        },
        eth: {
            contract_address: '0x0000000000000000000000000000000000000000',
            precision: {
                display: 5,
                db: 8,
                native: 18,
            },
        },
    },
};
const getCurrencyAddress = (currencyId, chainId = 1) => {
    var _a, _b;
    return chainConfig[chainId]
        ? (_b = (_a = chainConfig[chainId][currencyId]) === null || _a === void 0 ? void 0 : _a.contract_address) !== null && _b !== void 0 ? _b : ''
        : '';
};
exports.getCurrencyAddress = getCurrencyAddress;
function getCurrencyPrecision(currencyId, chainId = 1) {
    var _a;
    return chainConfig[chainId]
        ? (_a = chainConfig[chainId][currencyId]) === null || _a === void 0 ? void 0 : _a.precision
        : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VycmVuY3kuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2N1cnJlbmN5LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUEwSDZCLG9EQUFvQjtBQTFIakQsTUFBTSxXQUFXLEdBQVE7SUFDckIsUUFBUSxFQUFFO1FBQ04sVUFBVSxFQUFFLFNBQVM7UUFDckIsSUFBSSxFQUFFO1lBQ0YsZ0JBQWdCLEVBQUUsNENBQTRDLEVBQUUsK0NBQStDO1lBQy9HLFNBQVMsRUFBRTtnQkFDUCxPQUFPLEVBQUUsQ0FBQztnQkFDVixFQUFFLEVBQUUsQ0FBQztnQkFDTCxNQUFNLEVBQUUsRUFBRTthQUNiO1NBQ0o7UUFDRCxJQUFJLEVBQUU7WUFDRixnQkFBZ0IsRUFBRSw0Q0FBNEM7WUFDOUQsU0FBUyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEVBQUUsRUFBRSxDQUFDO2dCQUNMLE1BQU0sRUFBRSxDQUFDO2FBQ1o7U0FDSjtRQUNELEdBQUcsRUFBRTtZQUNELGdCQUFnQixFQUFFLDRDQUE0QztZQUM5RCxTQUFTLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsTUFBTSxFQUFFLEVBQUU7YUFDYjtTQUNKO0tBQ0o7SUFDRCxRQUFRLEVBQUU7UUFDTixVQUFVLEVBQUUsWUFBWTtRQUN4QixJQUFJLEVBQUU7WUFDRixnQkFBZ0IsRUFBRSw0Q0FBNEM7WUFDOUQsU0FBUyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEVBQUUsRUFBRSxDQUFDO2dCQUNMLE1BQU0sRUFBRSxFQUFFO2FBQ2I7U0FDSjtRQUNELElBQUksRUFBRTtZQUNGLGdCQUFnQixFQUFFLDRDQUE0QztZQUM5RCxTQUFTLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsTUFBTSxFQUFFLENBQUM7YUFDWjtTQUNKO1FBQ0QsR0FBRyxFQUFFO1lBQ0QsZ0JBQWdCLEVBQUUsNENBQTRDO1lBQzlELFNBQVMsRUFBRTtnQkFDUCxPQUFPLEVBQUUsQ0FBQztnQkFDVixFQUFFLEVBQUUsQ0FBQztnQkFDTCxNQUFNLEVBQUUsRUFBRTthQUNiO1NBQ0o7S0FDSjtJQUNELENBQUMsRUFBRTtRQUNDLFVBQVUsRUFBRSxTQUFTO1FBQ3JCLElBQUksRUFBRTtZQUNGLGdCQUFnQixFQUFFLDRDQUE0QztZQUM5RCxTQUFTLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsTUFBTSxFQUFFLENBQUM7YUFDWjtTQUNKO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsZ0JBQWdCLEVBQUUsNENBQTRDO1lBQzlELFNBQVMsRUFBRTtnQkFDUCxPQUFPLEVBQUUsQ0FBQztnQkFDVixFQUFFLEVBQUUsQ0FBQztnQkFDTCxNQUFNLEVBQUUsQ0FBQzthQUNaO1NBQ0o7UUFDRCxHQUFHLEVBQUU7WUFDRCxnQkFBZ0IsRUFBRSw0Q0FBNEM7WUFDOUQsU0FBUyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEVBQUUsRUFBRSxDQUFDO2dCQUNMLE1BQU0sRUFBRSxFQUFFO2FBQ2I7U0FDSjtLQUNKO0lBQ0QsRUFBRSxFQUFFO1FBQ0EsVUFBVSxFQUFFLFVBQVU7UUFDdEIsSUFBSSxFQUFFO1lBQ0YsZ0JBQWdCLEVBQUUsNENBQTRDO1lBQzlELFNBQVMsRUFBRTtnQkFDUCxPQUFPLEVBQUUsQ0FBQztnQkFDVixFQUFFLEVBQUUsQ0FBQztnQkFDTCxNQUFNLEVBQUUsQ0FBQzthQUNaO1NBQ0o7UUFDRCxJQUFJLEVBQUU7WUFDRixnQkFBZ0IsRUFBRSw0Q0FBNEM7WUFDOUQsU0FBUyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEVBQUUsRUFBRSxDQUFDO2dCQUNMLE1BQU0sRUFBRSxDQUFDO2FBQ1o7U0FDSjtRQUNELEdBQUcsRUFBRTtZQUNELGdCQUFnQixFQUFFLDRDQUE0QztZQUM5RCxTQUFTLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsTUFBTSxFQUFFLEVBQUU7YUFDYjtTQUNKO0tBQ0o7Q0FDSixDQUFDO0FBRUYsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFVBQWtCLEVBQUUsVUFBa0IsQ0FBQyxFQUFFLEVBQUU7O0lBQ25FLE9BQUEsV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUNoQixDQUFDLENBQUMsTUFBQSxNQUFBLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsMENBQUUsZ0JBQWdCLG1DQUFJLEVBQUU7UUFDMUQsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtDQUFBLENBQUM7QUFRSixnREFBa0I7QUFOM0IsU0FBUyxvQkFBb0IsQ0FBQyxVQUFrQixFQUFFLFVBQWtCLENBQUM7O0lBQ2pFLE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQztRQUN2QixDQUFDLENBQUMsTUFBQSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLDBDQUFFLFNBQVM7UUFDN0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUNwQixDQUFDIn0=