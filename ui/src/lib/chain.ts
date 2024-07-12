import { defineChain } from "thirdweb";
const uibit = defineChain({
  id: 44433,
  rpc: "https://testnet-rpc.ubitscan.io",
  testnet: true,
  nativeCurrency: {
    name: "USC",
    symbol: "USC",
    decimals: 18,
  }
})
export default uibit;

import {
  type Chain
} from 'viem'

export const ubitTestnet
  = {
    id: 44433,
    name: 'Ubit Testnet',
    nativeCurrency: {
      name: 'USC', 
      symbol: 'USC', 
      decimals: 18
    },
    rpcUrls: {
      default: {
        http: ['https://testnet-rpc.ubitscan.io']
      },
    },
    blockExplorers: {
      default: {
        name: 'UbitScan', 
        url: 'https://testnet.ubitscan.io'
      },
    },
  } as const satisfies Chain


