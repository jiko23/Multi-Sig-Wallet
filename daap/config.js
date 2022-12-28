export const Contract_ADDRESS = "0xf3D440Ef6a0404db33b14D91f819bb3C3A80227e"
export const NODE_URL = ''
export const WSS_URL = ''
export const abi = [
    {
      "inputs": [
        {
          "internalType": "contract CommunicationInterface",
          "name": "_walletInterface",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "_initialMemberAddressSet",
          "type": "address[]"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_pastAdmin",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_newAdmin",
          "type": "address"
        }
      ],
      "name": "AdminPowerTransfered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_senderAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_etherAmount",
          "type": "uint256"
        }
      ],
      "name": "EtherDeposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_authorizationPercent",
          "type": "uint256"
        }
      ],
      "name": "MinimumAuthorizationPercentage",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_newJoinieAddress",
          "type": "address"
        }
      ],
      "name": "OwnerNewJoinie",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_pastOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransfered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ownerAddress",
          "type": "address"
        }
      ],
      "name": "RemovedOwner",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_senderAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        }
      ],
      "name": "TransactionCancellation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_senderAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_reciverAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        }
      ],
      "name": "TransactionConfirmation",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        }
      ],
      "name": "TransactionExecutionFailure",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        }
      ],
      "name": "TransactionExecutionSuccess",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_senderAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_recieverAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amountToTransfer",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "_executionConfirmation",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "_transactionData",
          "type": "bytes"
        }
      ],
      "name": "TransactionSubmission",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newJoinee",
          "type": "address"
        }
      ],
      "name": "addNewOwnerToWallet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_presentAdmin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newAdmin",
          "type": "address"
        }
      ],
      "name": "adminOwnershipTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "authorizationPercentage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "confirmOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getOwners",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        }
      ],
      "name": "getTransaction",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "transactionid",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "senderAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recieverAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountTransfered",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "transactionExecutionState",
          "type": "bool"
        },
        {
          "internalType": "bytes",
          "name": "transactionData",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTransactionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_presentOwner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "ownershipTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "presentAdmin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "presentOwnersAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_memberAddress",
          "type": "address"
        }
      ],
      "name": "removeOwnerFromWallet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        }
      ],
      "name": "transactionCancelation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        }
      ],
      "name": "transactionConfirmation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "transactionConfirmedByAddress",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_transactionId",
          "type": "uint256"
        }
      ],
      "name": "transactionExcecution",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "transactionId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "transactions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "transactionId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "senderAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recieverAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountToTransfer",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "executionConfirmation",
          "type": "bool"
        },
        {
          "internalType": "bytes",
          "name": "transactionData",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_recieverAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amountToTransfer",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "_transactionData",
          "type": "bytes"
        }
      ],
      "name": "trsnsactionSubmission",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]