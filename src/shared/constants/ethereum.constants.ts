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

export const SUPPORTED_VIEM_CHAINS: Chain[] = [
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  hardhat,
];
