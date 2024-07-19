import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { getEthereumContractWithDefaultNode } from '@functions/configuration.functions';
import { Merchant, MerchantProofOfReserve } from '@models/merchant';
import { RootState } from '@store/index';
import { ProofOfReserveHandler } from 'dlc-btc-lib';
import { getAttestorGroupPublicKey, getContractVaults } from 'dlc-btc-lib/ethereum-functions';
import { RawVault } from 'dlc-btc-lib/models';
import { unshiftValue } from 'dlc-btc-lib/utilities';
import { Contract } from 'ethers';

import { BITCOIN_NETWORK_MAP } from '@shared/constants/bitcoin.constants';

import { useEthereumConfiguration } from './use-ethereum-configuration';

interface UseProofOfReserveReturnType {
  proofOfReserve: [number | undefined, MerchantProofOfReserve[]] | undefined;
}

export function useProofOfReserve(): UseProofOfReserveReturnType {
  const { network: ethereumNetwork } = useSelector((state: RootState) => state.account);

  const { ethereumContractDeploymentPlans } = useEthereumConfiguration();

  const [dlcManagerContract, setDLCManagerContract] = useState<Contract | undefined>(undefined);
  const [proofOfReserveHandler, setProofOfReserveHandler] = useState<
    ProofOfReserveHandler | undefined
  >(undefined);

  useEffect(() => {
    const fetchProofOfReserveHandlerAndDLCManagerContract = async () => {
      await getProofOfReserveHandlerAndDLCManagerContract();
    };
    void fetchProofOfReserveHandlerAndDLCManagerContract();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumNetwork]);

  async function getProofOfReserveHandlerAndDLCManagerContract(): Promise<void> {
    const dlcManagerContract = getEthereumContractWithDefaultNode(
      ethereumContractDeploymentPlans,
      ethereumNetwork,
      'DLCManager'
    );

    const attestorPublicKey = await getAttestorGroupPublicKey(dlcManagerContract);

    const proofOfReserveHandler = new ProofOfReserveHandler(
      appConfiguration.bitcoinBlockchainURL,
      BITCOIN_NETWORK_MAP[appConfiguration.bitcoinNetwork],
      attestorPublicKey
    );

    setDLCManagerContract(dlcManagerContract);
    setProofOfReserveHandler(proofOfReserveHandler);
  }

  const { data: proofOfReserve } = useQuery(['proofOfReserve'], calculateProofOfReserve, {
    enabled: !!proofOfReserveHandler,
    refetchInterval: 60000,
  });

  async function calculateProofOfReserve(): Promise<
    [number | undefined, MerchantProofOfReserve[]]
  > {
    if (!proofOfReserveHandler || !dlcManagerContract) {
      return [
        undefined,
        appConfiguration.merchants.map((merchant: Merchant) => {
          return {
            merchant,
            dlcBTCAmount: undefined,
          };
        }),
      ];
    }

    const allVaults = await getContractVaults(dlcManagerContract);

    const proofOfReserve = await proofOfReserveHandler.calculateProofOfReserve(allVaults);

    const promises = appConfiguration.merchants.map(async (merchant: Merchant) => {
      const proofOfReserve = await calculateProofOfReserveOfAddress(allVaults, merchant.address);
      return {
        merchant,
        dlcBTCAmount: proofOfReserve,
      };
    });

    const merchantProofOfReserves = await Promise.all(promises);

    return [unshiftValue(proofOfReserve), merchantProofOfReserves];
  }

  async function calculateProofOfReserveOfAddress(
    allVaults: RawVault[],
    ethereumAddress: string
  ): Promise<number> {
    if (!proofOfReserveHandler) return 0;
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
