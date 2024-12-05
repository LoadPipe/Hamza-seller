"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.massMarketPaymentAbi = void 0;
exports.massMarketPaymentAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_permit2",
                "type": "address",
                "internalType": "contract IPermit2"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getPaymentId",
        "inputs": [
            {
                "name": "payment",
                "type": "tuple",
                "internalType": "struct PaymentRequest",
                "components": [
                    {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "ttl",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "order",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "payeeAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isPaymentEndpoint",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "shopId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "shopSignature",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "hasPaymentBeenMade",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "payment",
                "type": "tuple",
                "internalType": "struct PaymentRequest",
                "components": [
                    {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "ttl",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "order",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "payeeAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isPaymentEndpoint",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "shopId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "shopSignature",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "multiPay",
        "inputs": [
            {
                "name": "payments",
                "type": "tuple[]",
                "internalType": "struct PaymentRequest[]",
                "components": [
                    {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "ttl",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "order",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "payeeAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isPaymentEndpoint",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "shopId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "shopSignature",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            },
            {
                "name": "permit2Sigs",
                "type": "bytes[]",
                "internalType": "bytes[]"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "pay",
        "inputs": [
            {
                "name": "payment",
                "type": "tuple",
                "internalType": "struct PaymentRequest",
                "components": [
                    {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "ttl",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "order",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "payeeAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isPaymentEndpoint",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "shopId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "shopSignature",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "payNative",
        "inputs": [
            {
                "name": "payment",
                "type": "tuple",
                "internalType": "struct PaymentRequest",
                "components": [
                    {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "ttl",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "order",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "payeeAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isPaymentEndpoint",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "shopId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "shopSignature",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "payToken",
        "inputs": [
            {
                "name": "payment",
                "type": "tuple",
                "internalType": "struct PaymentRequest",
                "components": [
                    {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "ttl",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "order",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "payeeAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isPaymentEndpoint",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "shopId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "shopSignature",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            },
            {
                "name": "permit2signature",
                "type": "bytes",
                "internalType": "bytes"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "payTokenPreApproved",
        "inputs": [
            {
                "name": "payment",
                "type": "tuple",
                "internalType": "struct PaymentRequest",
                "components": [
                    {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "ttl",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "order",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "payeeAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isPaymentEndpoint",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "shopId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "shopSignature",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "revertPayment",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "payment",
                "type": "tuple",
                "internalType": "struct PaymentRequest",
                "components": [
                    {
                        "name": "chainId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "ttl",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "order",
                        "type": "bytes32",
                        "internalType": "bytes32"
                    },
                    {
                        "name": "currency",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "payeeAddress",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "isPaymentEndpoint",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "shopId",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "shopSignature",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "PaymentMade",
        "inputs": [
            {
                "name": "paymentId",
                "type": "uint256",
                "indexed": true,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "error",
        "name": "InvalidPaymentAmount",
        "inputs": []
    },
    {
        "type": "error",
        "name": "InvalidPaymentToken",
        "inputs": []
    },
    {
        "type": "error",
        "name": "NotPayee",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PayeeRefusedPayment",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PaymentAlreadyMade",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PaymentExpired",
        "inputs": []
    },
    {
        "type": "error",
        "name": "PaymentNotMade",
        "inputs": []
    },
    {
        "type": "error",
        "name": "WrongChain",
        "inputs": []
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzc21hcmtldC1wYXltZW50LWFiaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWIzL2FiaS9tYXNzbWFya2V0LXBheW1lbnQtYWJpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsb0JBQW9CLEdBQUc7SUFDaEM7UUFDSSxNQUFNLEVBQUUsYUFBYTtRQUNyQixRQUFRLEVBQUU7WUFDTjtnQkFDSSxNQUFNLEVBQUUsVUFBVTtnQkFDbEIsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLGNBQWMsRUFBRSxtQkFBbUI7YUFDdEM7U0FDSjtRQUNELGlCQUFpQixFQUFFLFlBQVk7S0FDbEM7SUFDRDtRQUNJLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE1BQU0sRUFBRSxjQUFjO1FBQ3RCLFFBQVEsRUFBRTtZQUNOO2dCQUNJLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixNQUFNLEVBQUUsT0FBTztnQkFDZixjQUFjLEVBQUUsdUJBQXVCO2dCQUN2QyxZQUFZLEVBQUU7b0JBQ1Y7d0JBQ0ksTUFBTSxFQUFFLFNBQVM7d0JBQ2pCLE1BQU0sRUFBRSxTQUFTO3dCQUNqQixjQUFjLEVBQUUsU0FBUztxQkFDNUI7b0JBQ0Q7d0JBQ0ksTUFBTSxFQUFFLEtBQUs7d0JBQ2IsTUFBTSxFQUFFLFNBQVM7d0JBQ2pCLGNBQWMsRUFBRSxTQUFTO3FCQUM1QjtvQkFDRDt3QkFDSSxNQUFNLEVBQUUsT0FBTzt3QkFDZixNQUFNLEVBQUUsU0FBUzt3QkFDakIsY0FBYyxFQUFFLFNBQVM7cUJBQzVCO29CQUNEO3dCQUNJLE1BQU0sRUFBRSxVQUFVO3dCQUNsQixNQUFNLEVBQUUsU0FBUzt3QkFDakIsY0FBYyxFQUFFLFNBQVM7cUJBQzVCO29CQUNEO3dCQUNJLE1BQU0sRUFBRSxRQUFRO3dCQUNoQixNQUFNLEVBQUUsU0FBUzt3QkFDakIsY0FBYyxFQUFFLFNBQVM7cUJBQzVCO29CQUNEO3dCQUNJLE1BQU0sRUFBRSxjQUFjO3dCQUN0QixN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