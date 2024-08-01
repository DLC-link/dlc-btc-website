import { Chain } from 'viem';
import { arbitrum, arbitrumSepolia, hardhat } from 'viem/chains';

export const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';
export const SUPPORTED_VIEM_CHAINS: Chain[] = [arbitrum, arbitrumSepolia, hardhat];
