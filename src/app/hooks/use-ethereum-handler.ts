import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { connectEthereumAccount, getWalletProvider } from '@functions/ethereum-account.functions';
import { WalletType } from '@models/wallet';
import { RootState } from '@store/index';
import { accountActions } from '@store/slices/account/account.actions';
import { EthereumHandler, ReadOnlyEthereumHandler } from 'dlc-btc-lib';
import { fetchEthereumDeploymentPlansByNetwork } from 'dlc-btc-lib/ethereum-functions';
import { SupportedNetwork } from 'dlc-btc-lib/models';

import { useEthereumConfiguration } from './use-ethereum-configuration';

interface UseEthereumHandlerReturnType {
  ethereumHandler: EthereumHandler | undefined;
  readOnlyEthereumHandler: ReadOnlyEthereumHandler | undefined;
  isEthereumHandlerSet: boolean;
  isReadOnlyEthereumHandlerSet: boolean;
  getEthereumHandler: (
    ethereumWalletType: WalletType,
    ethereumNetwork: SupportedNetwork
  ) => Promise<void>;
  recommendTokenToMetamask: () => Promise<void>;
}

export function useEthereumHandler(): UseEthereumHandlerReturnType {
  const dispatch = useDispatch();

  const [ethereumHandler, setEthereumHandler] = useState<EthereumHandler | undefined>(undefined);
  const [readOnlyEthereumHandler, setReadOnlyEthereumHandler] = useState<
    ReadOnlyEthereumHandler | undefined
  >(undefined);

  const [isEthereumHandlerSet, setIsEthereumHandlerSet] = useState<boolean>(false);
  const [isReadOnlyEthereumHandlerSet, setIsReadOnlyEthereumHandlerSet] = useState<boolean>(false);

  const { ethereumNetworkName } = useEthereumConfiguration();

  const {
    address: ethereumUserAddress,
    walletType: ethereumWalletType,
    network: ethereumNetwork,
  } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (isEthereumHandlerSet) return;

    const fetchEthereumHandler = async () => {
      if (ethereumUserAddress) {
        console.log('Fetching Ethereum Handler');

        await getEthereumHandler(ethereumWalletType, ethereumNetworkName);
      }
    };

    fetchEthereumHandler();
  }, [ethereumUserAddress, ethereumNetwork]);

  useEffect(() => {
    console.log('Fetching Read Only Ethereum Handler');
    console.log('appConfiguration', appConfiguration);
    const { infuraWebsocketURL } = appConfiguration;

    console.log('infuraWebsocketURL', infuraWebsocketURL);
    const fetchReadOnlyEthereumHandler = async () => {
      await getReadOnlyEthereumHandler(ethereumNetworkName, appConfiguration.infuraWebsocketURL);
    };

    fetchReadOnlyEthereumHandler();
  }, [ethereumNetwork]);

  async function getEthereumHandler(
    ethereumWalletType: WalletType,
    ethereumNetworkName: SupportedNetwork
  ): Promise<void> {
    const { ethereumUserAddress, ethereumSigner } = await connectEthereumAccount(
      ethereumWalletType,
      ethereumNetwork
    );

    console.log('ethereumSigner', ethereumSigner);

    const ethereumDeploymentPlans =
      await fetchEthereumDeploymentPlansByNetwork(ethereumNetworkName);

    const ethereumHandler = EthereumHandler.fromSigner(ethereumDeploymentPlans, ethereumSigner);

    console.log('ethereumHandler', ethereumHandler);

    setEthereumHandler(ethereumHandler);
    setIsEthereumHandlerSet(true);

    dispatch(
      accountActions.login({ address: ethereumUserAddress, walletType: ethereumWalletType })
    );
  }

  async function getReadOnlyEthereumHandler(
    ethereumNetworkName: SupportedNetwork,
    infuraWebsocketURL: string
  ) {
    const ethereumDeploymentPlans =
      await fetchEthereumDeploymentPlansByNetwork(ethereumNetworkName);

    const readOnlyEthereumHandler = new ReadOnlyEthereumHandler(
      ethereumDeploymentPlans,
      infuraWebsocketURL
    );

    setReadOnlyEthereumHandler(readOnlyEthereumHandler);
    setIsReadOnlyEthereumHandlerSet(true);
  }

  async function recommendTokenToMetamask(): Promise<void> {
    try {
      if (!ethereumHandler) {
        throw new Error('Ethereum Handler not set');
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
    readOnlyEthereumHandler,
    isEthereumHandlerSet,
    isReadOnlyEthereumHandlerSet,
    getEthereumHandler,
    recommendTokenToMetamask,
  };
}
