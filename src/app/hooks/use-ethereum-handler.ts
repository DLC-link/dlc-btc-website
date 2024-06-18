import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { connectEthereumAccount, getWalletProvider } from '@functions/ethereum-account.functions';
import { WalletType } from '@models/wallet';
import { RootState } from '@store/index';
import { accountActions } from '@store/slices/account/account.actions';
import { EthereumHandler, ReadOnlyEthereumHandler } from 'dlc-btc-lib';
import { ethereumArbitrumSepolia } from 'dlc-btc-lib/constants';
import { fetchEthereumDeploymentPlansByNetwork } from 'dlc-btc-lib/ethereum-functions';
import { SupportedNetwork } from 'dlc-btc-lib/models';
import { Contract, ethers } from 'ethers';

import { useEthereumConfiguration } from './use-ethereum-configuration';

interface UseEthereumHandlerReturnType {
  ethereumHandler: EthereumHandler | undefined;
  readOnlyEthereumHandler: ReadOnlyEthereumHandler | undefined;
  userPointsContractReader: Contract | undefined;
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
  const [userPointsContractReader, setUserPointsContractReader] = useState<Contract | undefined>(
    undefined
  );

  const [isEthereumHandlerSet, setIsEthereumHandlerSet] = useState<boolean>(false);
  const [isReadOnlyEthereumHandlerSet, setIsReadOnlyEthereumHandlerSet] = useState<boolean>(false);

  const { ethereumNetworkName } = useEthereumConfiguration();

  const {
    address: ethereumUserAddress,
    walletType: ethereumWalletType,
    network: ethereumNetwork,
  } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    const fetchEthereumHandler = async () => {
      if (ethereumUserAddress) {
        await getEthereumHandler(ethereumWalletType, ethereumNetworkName);
      }
    };

    void fetchEthereumHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumUserAddress, ethereumNetwork]);

  useEffect(() => {
    const { infuraWebsocketURL } = appConfiguration;

    const fetchReadOnlyEthereumHandler = async () => {
      await getReadOnlyEthereumHandler(ethereumNetworkName, infuraWebsocketURL);
    };

    void fetchReadOnlyEthereumHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumNetwork]);

  async function getEthereumHandler(
    ethereumWalletType: WalletType,
    ethereumNetworkName: SupportedNetwork
  ): Promise<void> {
    const { ethereumUserAddress, ethereumSigner } = await connectEthereumAccount(
      ethereumWalletType,
      ethereumNetwork
    );

    const ethereumDeploymentPlans =
      await fetchEthereumDeploymentPlansByNetwork(ethereumNetworkName);

    const provider = ethers.providers.getDefaultProvider('http://54.243.139.139:8547/ ');

    const dlcBTCContractDeploymentPlan = ethereumDeploymentPlans.find(
      plan => plan.contract.name === 'DLCBTC'
    );

    if (!dlcBTCContractDeploymentPlan) {
      throw new Error(`DLCBTC Contract not found in Deployment Plans`);
    }

    const currentUserPointsContractReader = new Contract(
      dlcBTCContractDeploymentPlan.contract.address,
      dlcBTCContractDeploymentPlan.contract.abi,
      provider
    );

    const ethereumHandler = EthereumHandler.fromSigner(ethereumDeploymentPlans, ethereumSigner);

    setUserPointsContractReader(currentUserPointsContractReader);
    setEthereumHandler(ethereumHandler);
    setIsEthereumHandlerSet(true);

    dispatch(
      accountActions.login({
        address: ethereumUserAddress,
        walletType: ethereumWalletType,
        network: ethereumArbitrumSepolia,
      })
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
    userPointsContractReader,
    isEthereumHandlerSet,
    isReadOnlyEthereumHandlerSet,
    getEthereumHandler,
    recommendTokenToMetamask,
  };
}
