export const RaffleABI = [
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_entryFee",
        "type": "uint256"
    }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "newFee",
        "type": "uint256"
    }
    ],
    "name": "EntryFeeChanged",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "entryCount",
        "type": "uint256"
    }
    ],
    "name": "PlayerEntered",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    }
    ],
    "name": "RaffleReset",
    "type": "event"
},
{
    "anonymous": false,
    "inputs": [
    {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
    },
    {
        "indexed": false,
        "internalType": "uint256",
        "name": "prizeAmount",
        "type": "uint256"
    }
    ],
    "name": "WinnerPicked",
    "type": "event"
},
{
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "enter",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "times",
        "type": "uint256"
    }
    ],
    "name": "enterMultiple",
    "outputs": [],
    "stateMutability": "payable",
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
    "name": "entryCount",
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
    "inputs": [],
    "name": "entryFee",
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
    "inputs": [],
    "name": "getLatestWinner",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    },
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
    "inputs": [],
    "name": "getMyEntryCount",
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
    "inputs": [],
    "name": "getPlayerCount",
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
    "inputs": [],
    "name": "getPlayers",
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
    "inputs": [],
    "name": "getPrizePool",
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
    "inputs": [],
    "name": "getRaffleHistory",
    "outputs": [
    {
        "components": [
        {
            "internalType": "address",
            "name": "winner",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "prizeAmount",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "participantCount",
            "type": "uint256"
        }
        ],
        "internalType": "struct Raffle.RaffleRound[]",
        "name": "",
        "type": "tuple[]"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "address",
        "name": "player",
        "type": "address"
    }
    ],
    "name": "getWinCount",
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
    "inputs": [],
    "name": "isActive",
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
    "name": "owner",
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
    "inputs": [],
    "name": "pickWinner",
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
    }
    ],
    "name": "players",
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
    "inputs": [],
    "name": "prizePool",
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
    "name": "raffleHistory",
    "outputs": [
    {
        "internalType": "address",
        "name": "winner",
        "type": "address"
    },
    {
        "internalType": "uint256",
        "name": "prizeAmount",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
    },
    {
        "internalType": "uint256",
        "name": "participantCount",
        "type": "uint256"
    }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [],
    "name": "resetRaffle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
    {
        "internalType": "uint256",
        "name": "_newFee",
        "type": "uint256"
    }
    ],
    "name": "setEntryFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "toggleRaffle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [],
    "name": "winner",
    "outputs": [
    {
        "internalType": "address",
        "name": "",
        "type": "address"
    }
    ],
    "stateMutability": "view",
    "type": "function"
}
];