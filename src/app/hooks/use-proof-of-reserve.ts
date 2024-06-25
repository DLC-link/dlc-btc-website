import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { Merchant, MerchantProofOfReserve } from '@models/merchant';
import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import { RootState } from '@store/index';
import { ProofOfReserveHandler } from 'dlc-btc-lib';
import { RawVault } from 'dlc-btc-lib/models';
import { unshiftValue } from 'dlc-btc-lib/utilities';

import { BITCOIN_NETWORK_MAP } from '@shared/constants/map.constants';

interface UseProofOfReserveReturnType {
  proofOfReserve: [number | undefined, MerchantProofOfReserve[]] | undefined;
}

export function useProofOfReserve(): UseProofOfReserveReturnType {
  const { readOnlyEthereumHandler } = useContext(EthereumHandlerContext);
  const { network } = useSelector((state: RootState) => state.account);

  const [proofOfReserveHandler, setProofOfReserveHandler] = useState<
    ProofOfReserveHandler | undefined
  >(undefined);

  useEffect(() => {
    const fetchProofOfReserveHandler = async () => {
      await getProofOfReserveHandler();
    };
    void fetchProofOfReserveHandler();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, readOnlyEthereumHandler]);

  async function getProofOfReserveHandler(): Promise<void> {
    if (!readOnlyEthereumHandler) return;

    const attestorPublicKey = await readOnlyEthereumHandler.getAttestorGroupPublicKey();

    const proofOfReserveHandler = new ProofOfReserveHandler(
      appConfiguration.bitcoinBlockchainURL,
      BITCOIN_NETWORK_MAP[appConfiguration.bitcoinNetwork],
      attestorPublicKey
    );

    setProofOfReserveHandler(proofOfReserveHandler);
  }

  const { data: proofOfReserve } = useQuery(['proofOfReserve'], calculateProofOfReserve, {
    enabled: !!proofOfReserveHandler,
    refetchInterval: 60000,
  });

  async function calculateProofOfReserve(): Promise<
    [number | undefined, MerchantProofOfReserve[]]
  > {
    if (!readOnlyEthereumHandler) return [undefined, []];

    const fundedVaults = await readOnlyEthereumHandler?.getContractFundedVaults();

    if (!proofOfReserveHandler) {
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

    const proofOfReserve = await proofOfReserveHandler.calculateProofOfReserve(fundedVaults);

    const promises = appConfiguration.merchants.map(async (merchant: Merchant) => {
      const proofOfReserve = await calculateProofOfReserveOfAddress(fundedVaults, merchant.address);
      return {
        merchant,
        dlcBTCAmount: proofOfReserve,
      };
    });

    const merchantProofOfReserves = await Promise.all(promises);

    return [unshiftValue(proofOfReserve), merchantProofOfReserves];
  }

  async function calculateProofOfReserveOfAddress(
    fundedVaults: RawVault[],
    ethereumAddress: string
  ): Promise<number> {
    if (!proofOfReserveHandler) return 0;

    const filteredVaults = fundedVaults.filter(
      vault => vault.creator.toLowerCase() === ethereumAddress
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
