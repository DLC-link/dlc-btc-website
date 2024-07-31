import { useContext } from 'react';

import { Merchant, MerchantProofOfReserve } from '@models/merchant';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { useQuery } from '@tanstack/react-query';
import { ProofOfReserveHandler } from 'dlc-btc-lib';
import { getAttestorGroupPublicKey, getContractVaults } from 'dlc-btc-lib/ethereum-functions';
import { RawVault } from 'dlc-btc-lib/models';
import { unshiftValue } from 'dlc-btc-lib/utilities';

import { BITCOIN_NETWORK_MAP } from '@shared/constants/bitcoin.constants';

interface UseProofOfReserveReturnType {
  proofOfReserve: [number | undefined, MerchantProofOfReserve[]] | undefined;
}

export function useProofOfReserve(): UseProofOfReserveReturnType {
  const { getReadOnlyDLCManagerContract } = useContext(EthereumNetworkConfigurationContext);

  const { data: proofOfReserve } = useQuery({
    queryKey: ['proofOfReserve'],
    queryFn: calculateProofOfReserve,
    refetchInterval: 60000,
  });

  async function calculateProofOfReserve(): Promise<
    [number | undefined, MerchantProofOfReserve[]]
  > {
    const attestorGroupPublicKey = await getAttestorGroupPublicKey(getReadOnlyDLCManagerContract());
    const proofOfReserveHandler = new ProofOfReserveHandler(
      appConfiguration.bitcoinBlockchainURL,
      BITCOIN_NETWORK_MAP[appConfiguration.bitcoinNetwork],
      attestorGroupPublicKey
    );

    const allVaults = await getContractVaults(getReadOnlyDLCManagerContract());

    const proofOfReserve = await proofOfReserveHandler.calculateProofOfReserve(allVaults);
    1;

    const promises = appConfiguration.merchants.map(async (merchant: Merchant) => {
      const proofOfReserve = await calculateProofOfReserveOfAddress(
        proofOfReserveHandler,
        allVaults,
        merchant.address
      );
      return {
        merchant,
        dlcBTCAmount: proofOfReserve,
      };
    });

    const merchantProofOfReserves = await Promise.all(promises);

    return [unshiftValue(proofOfReserve), merchantProofOfReserves];
  }

  async function calculateProofOfReserveOfAddress(
    proofOfReserveHandler: ProofOfReserveHandler,
    allVaults: RawVault[],
    ethereumAddress: string
  ): Promise<number> {
    const filteredVaults = allVaults.filter(
      vault => vault.creator.toLowerCase() === ethereumAddress.toLowerCase()
    );

    const proofOfReserve = await proofOfReserveHandler.calculateProofOfReserve(filteredVaults);

    return unshiftValue(proofOfReserve);
  }

  return {
    proofOfReserve: proofOfReserve ?? [
      undefined,
      appConfiguration.merchants.map((merchant: Merchant) => {
        return {
          merchant,
          dlcBTCAmount: undefined,
        };
      }),
    ],
  };
}
