import { Chain } from 'viem';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  hardhat,
  mainnet,
  sepolia,
} from 'viem/chains';

export const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';
export const SUPPORTED_VIEM_CHAINS: Chain[] = [
  arbitrum,
  arbitrumSepolia,
  mainnet,
  sepolia,
  base,
  baseSepolia,
  hardhat,
];
