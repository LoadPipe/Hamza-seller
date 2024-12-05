"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liteSwitchAbi = void 0;
exports.liteSwitchAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "securityContext",
                "type": "address",
                "internalType": "contract ISecurityContext"
            },
            {
                "name": "vault",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "ADMIN_ROLE",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "APPROVER_ROLE",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "DAO_ROLE",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "PAUSER_ROLE",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "REFUNDER_ROLE",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "SYSTEM_ROLE",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "UPGRADER_ROLE",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "placeMultiPayments",
        "inputs": [
            {
                "name": "multiPayments",
                "type": "tuple[]",
                "internalType": "struct MultiPaymentInput[]",
                "components": [
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "payments",
                        "type": "tuple[]",
                        "internalType": "struct PaymentInput[]",
                        "components": [
                            {
                                "name": "id",
                                "type": "uint256",
                                "internalType": "uint256"
                            },
                            {
                                "name": "orderId",
                                "type": "string",
                                "internalType": "string"
                            },
                            {
                                "name": "receiver",
                                "type": "address",
                                "internalType": "address"
                            },
                            {
                                "name": "payer",
                                "type": "address",
                                "internalType": "address"
                            },
                            {
                                "name": "amount",
                                "type": "uint256",
                                "internalType": "uint256"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "immediateSweep",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "securityContext",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "contract ISecurityContext"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setSecurityContext",
        "inputs": [
            {
                "name": "_securityContext",
                "type": "address",
                "internalType": "contract ISecurityContext"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "setVaultAddress",
        "inputs": [
            {
                "name": "_vaultAddress",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "sweep",
        "inputs": [
            {
                "name": "tokenAddressOrZero",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "vaultAddress",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "PaymentReceived",
        "inputs": [
            {
                "name": "orderId",
                "type": "string",
                "indexed": true,
                "internalType": "string"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "from",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "currency",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PaymentSweepFailed",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "currency",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "PaymentSwept",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "currency",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "SecurityContextSet",
        "inputs": [
            {
                "name": "caller",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "securityContext",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "VaultAddressChanged",
        "inputs": [
            {
                "name": "newAddress",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            },
            {
                "name": "changedBy",
                "type": "address",
                "indexed": false,
                "internalType": "address"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "UnauthorizedAccess",
        "inputs": [
            {
                "name": "roleId",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "addr",
                "type": "address",
                "internalType": "address"
            }
        ]
    },
    {
        "type": "error",
        "name": "ZeroAddressArgument",
        "inputs": []
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl0ZS1zd2l0Y2gtYWJpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dlYjMvYWJpL2xpdGUtc3dpdGNoLWFiaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLGFBQWEsR0FBRztJQUN6QjtRQUNJLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLFFBQVEsRUFBRTtZQUNOO2dCQUNJLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixjQUFjLEVBQUUsMkJBQTJCO2FBQzlDO1lBQ0Q7Z0JBQ0ksTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLGNBQWMsRUFBRSxTQUFTO2FBQzVCO1NBQ0o7UUFDRCxpQkFBaUIsRUFBRSxZQUFZO0tBQ2xDO0lBQ0Q7UUFDSSxNQUFNLEVBQUUsU0FBUztRQUNqQixpQkFBaUIsRUFBRSxTQUFTO0tBQy9CO0lBQ0Q7UUFDSSxNQUFNLEVBQUUsVUFBVTtRQUNsQixNQUFNLEVBQUUsWUFBWTtRQUNwQixRQUFRLEVBQUUsRUFFVDtRQUNELFNBQVMsRUFBRTtZQUNQO2dCQUNJLE1BQU0sRUFBRSxFQUFFO2dCQUNWLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixjQUFjLEVBQUUsU0FBUzthQUM1QjtTQUNKO1FBQ0QsaUJBQWlCLEVBQUUsTUFBTTtLQUM1QjtJQUNEO1FBQ0ksTUFBTSxFQUFFLFVBQVU7UUFDbEIsTUFBTSxFQUFFLGVBQWU7UUFDdkIsUUFBUSxFQUFFLEVBRVQ7UUFDRCxTQUFTLEVBQUU7WUFDUDtnQkFDSSxNQUFNLEVBQUUsRUFBRTtnQkFDVixNQUFNLEVBQUUsU0FBUztnQkFDakIsY0FBYyxFQUFFLFNBQVM7YUFDNUI7U0FDSjtRQUNELGlCQUFpQixFQUFFLE1BQU07S0FDNUI7SUFDRDtRQUNJLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLFFBQVEsRUFBRSxFQUVUO1FBQ0QsU0FBUyxF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