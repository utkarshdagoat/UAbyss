export const STABLE_MANGER="0x0199C36c9A40A70f5d2C3646944D515083b17C87";
export const STABLE_COIN = "0x8b0EcAf645e72771B25a814FdB0c33be5d9faad1";
export const ADDR = "0x5a381bDE1F3cB5eDDE26843c43eEc5B194F26F46";
export const PROXY = "0x5a381bDE1F3cB5eDDE26843c43eEc5B194F26F46";
export const COUNTER = [
  {
    "type": "function",
    "name": "count",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decrement",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "increment",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;
