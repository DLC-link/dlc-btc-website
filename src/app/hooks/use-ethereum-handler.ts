import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getEthereumNetworkDeploymentPlans } from '@functions/configuration.functions';
import { connectEthereumAccount, getWalletProvider } from '@functions/ethereum-account.functions';
import { WalletType } from '@models/wallet';
import { RootState } from '@store/index';
import { accountActions } from '@store/slices/account/account.actions';
import { EthereumHandler } from 'dlc-btc-lib';
import { EthereumNetwork } from 'dlc-btc-lib/models';

interface UseEthereumHandlerReturnType {
  ethereumHandler: EthereumHandler | undefined;
  isEthereumHandlerSet: boolean;
  getEthereumHandler: (
    ethereumWalletType: WalletType,
    ethereumNetwork: EthereumNetwork
  ) => Promise<void>;
  recommendTokenToMetamask: () => Promise<void>;
}

export function useEthereumHandler(): UseEthereumHandlerReturnType {
  const dispatch = useDispatch();

  const [ethereumHandler, setEthereumHandler] = useState<EthereumHandler | undefined>(undefined);

  const [isEthereumHandlerSet, setIsEthereumHandlerSet] = useState<boolean>(false);

  const {
    address: ethereumUserAddress,
    walletType: ethereumWalletType,
    network: ethereumNetwork,
  } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    const fetchEthereumHandler = async () => {
      if (ethereumUserAddress && ethereumWalletType) {
        await getEthereumHandler(ethereumWalletType, ethereumNetwork);
      }
    };

    void fetchEthereumHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumUserAddress, ethereumNetwork]);

  async function getEthereumHandler(
    ethereumWalletType: WalletType,
    ethereumNetwork: EthereumNetwork
  ): Promise<void> {
    const { ethereumUserAddress, ethereumSigner } = await connectEthereumAccount(
      ethereumWalletType,
      ethereumNetwork
    );

    const ethereumDeploymentPlans = getEthereumNetworkDeploymentPlans(ethereumNetwork);

    const ethereumHandler = EthereumHandler.fromSigner(ethereumDeploymentPlans, ethereumSigner);

    setEthereumHandler(ethereumHandler);
    setIsEthereumHandlerSet(true);

    dispatch(
      accountActions.login({
        address: ethereumUserAddress,
        walletType: ethereumWalletType,
        network: ethereumNetwork,
      })
    );
  }

  async function recommendTokenToMetamask(): Promise<void> {
    try {
      if (!ethereumHandler) {
        throw new Error('Ethereum Handler not set');
      }

      if (!ethereumWalletType) {
        throw new Error('Ethereum Wallet Type not set');
      }

      const { dlcBTCContract } = ethereumHandler.getContracts();

      const walletProvider = getWalletProvider(ethereumWalletType);

      const response = await walletProvider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: dlcBTCContract?.address,
            symbol: 'dlcBTC',
            decimals: 8,
            image: 'https://dlc-public-assets.s3.amazonaws.com/dlcBTC_Token.png',
          },
        },
      });
      await response.wait();
    } catch (error) {
      throw new Error(`Could not recommend dlcBTC token to MetaMask: , ${error}`);
    }
  }

  return {
    ethereumHandler,
    isEthereumHandlerSet,
    getEthereumHandler,
    recommendTokenToMetamask,
  };
}
