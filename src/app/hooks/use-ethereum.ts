/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { customShiftValue } from "@common/utilities";
import { EthereumError } from "@models/error-types";
import { Network, ethereumNetworks } from "@models/network";
import { RawVault, Vault, VaultState } from "@models/vault";
import { RootState, store } from "@store/index";
import { accountActions } from "@store/slices/account/account.actions";
import { vaultActions } from "@store/slices/vault/vault.actions";
import { Contract, Signer, ethers } from "ethers";
import { Logger } from "ethers/lib/utils";

import { useVaults } from "./use-vaults";

export interface UseEthereumReturnType {
  protocolContract: Contract | undefined;
  dlcManagerContract: Contract | undefined;
  dlcBTCContract: Contract | undefined;
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
  requestEthereumAccount: (network: Network) => Promise<void>;
  getAllVaults: () => Promise<void>;
  getVault: (vaultUUID: string, vaultState: VaultState) => Promise<void>;
  setupVault: (btcDepositAmount: number) => Promise<void>;
  closeVault: (vaultUUID: string) => Promise<void>;
  recommendTokenToMetamask: () => Promise<boolean>;
}

function throwEthereumError(message: string, error: any): void {
  if (error.code === Logger.errors.CALL_EXCEPTION) {
    throw new EthereumError(
      `${message}${
        error instanceof Error && "errorName" in error ? error.errorName : error
      }`,
    );
  } else {
    throw new EthereumError(`${message}${error.code}`);
  }
}

export function useEthereum(): UseEthereumReturnType {
  const { fundedVaults } = useVaults();
  const { address, network } = useSelector((state: RootState) => state.account);

  const [protocolContract, setProtocolContract] = useState<
    Contract | undefined
  >(undefined);
  const [dlcManagerContract, setDlcManagerContract] = useState<
    Contract | undefined
  >(undefined);
  const [dlcBTCContract, setDlcBTCContract] = useState<Contract | undefined>(
    undefined,
  );

  const [dlcBTCBalance, setDLCBTCBalance] = useState<number | undefined>(
    undefined,
  );
  const [lockedBTCBalance, setLockedBTCBalance] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!address || !network) return;

    if (!protocolContract && !dlcManagerContract && !dlcBTCContract) {
      setupEthereumConfiguration(network);
    }
  }, [address, network, protocolContract, dlcManagerContract, dlcBTCContract]);

  useEffect(() => {
    if (!address || !network || !protocolContract) return;

    getAllVaults();
  }, [address, network, protocolContract]);

  useEffect(() => {
    if (!address || !protocolContract || !dlcManagerContract || !dlcBTCContract)
      return;

    const fetchBalance = async () => {
      try {
        await getDLCBTCBalance();
        await getLockedBTCBalance();
      } catch (error) {
        throwEthereumError(`Could not fetch balance: `, error);
      }
    };

    fetchBalance();
  }, [
    address,
    fundedVaults,
    protocolContract,
    dlcManagerContract,
    dlcBTCContract,
  ]);

  function formatVault(vault: any): Vault {
    return {
      uuid: vault.uuid,
      collateral: customShiftValue(parseInt(vault.valueLocked), 8, true),
      state: vault.status,
      fundingTX: vault.fundingTxId,
      closingTX: vault.closingTxId,
      timestamp: parseInt(vault.timestamp),
    };
  }

  async function setupEthereumConfiguration(network: Network): Promise<void> {
    const ethereumProvider = await getEthereumProvider(network);
    if (!ethereumProvider) {
      throw new EthereumError("Failed to get Ethereum provider");
    }
    const { walletNetworkChainID, signer } = ethereumProvider;
    await getEthereumContracts(walletNetworkChainID, signer);
  }

  async function getEthereumProvider(network: Network) {
    try {
      const { ethereum } = window;
      const browserProvider = new ethers.providers.Web3Provider(ethereum);
      const signer = browserProvider.getSigner();

      const walletNetwork = await browserProvider.getNetwork();
      const walletNetworkChainID = walletNetwork.chainId.toString();

      if (walletNetworkChainID !== network?.id) {
        alert(`Please connect to ${network?.name}`);
        return;
      }
      return { walletNetworkChainID, signer };
    } catch (error) {
      throwEthereumError(`Could not connect to Ethereum: `, error);
    }
  }

  async function getEthereumContracts(
    chainName: string,
    ethereumSigner: Signer,
  ): Promise<void> {
    if (!protocolContract) {
      const protocolContractData = await fetchEthereumDeploymentPlan(
        "TokenManager",
        chainName,
      );
      const protocolContract = new ethers.Contract(
        protocolContractData.contract.address,
        protocolContractData.contract.abi,
        ethereumSigner,
      );
      setProtocolContract(protocolContract);
    }

    if (!dlcManagerContract) {
      const dlcManagerContractData = await fetchEthereumDeploymentPlan(
        "DLCManager",
        chainName,
      );
      const dlcManagerContract = new ethers.Contract(
        dlcManagerContractData.contract.address,
        dlcManagerContractData.contract.abi,
        ethereumSigner,
      );
      setDlcManagerContract(dlcManagerContract);
    }

    if (!dlcBTCContract) {
      const dlcBTCContractData = await fetchEthereumDeploymentPlan(
        "DLCBTC",
        chainName,
      );
      const dlcBTCContract = new ethers.Contract(
        dlcBTCContractData.contract.address,
        dlcBTCContractData.contract.abi,
        ethereumSigner,
      );
      setDlcBTCContract(dlcBTCContract);
    }
  }

  async function requestEthereumAccount(network: Network) {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Install MetaMask!");
        return;
      }

      const ethereumAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const accountInformation = {
        walletType: "metamask",
        address: ethereumAccounts[0],
        network,
      };

      await setupEthereumConfiguration(network);

      store.dispatch(accountActions.login(accountInformation));
    } catch (error) {
      throwEthereumError(`Could not connect to Ethereum: `, error);
    }
  }

  async function fetchEthereumDeploymentPlan(
    contractName: string,
    chainID: string,
  ) {
    const network = ethereumNetworks.find((network) => network.id === chainID);

    const branchName = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_BRANCH;
    const contractVersion = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_VERSION;
    const deploymentPlanURL = `https://raw.githubusercontent.com/DLC-link/dlc-solidity/${branchName}/deploymentFiles/${network?.name.toLowerCase()}/v${contractVersion}/${contractName}.json`;

    console.log(
      `Fetching deployment info for ${contractName} on ${network?.name} from dlc-solidity/${branchName}`,
    );

    try {
      const response = await fetch(deploymentPlanURL);
      const contractData = await response.json();
      return contractData;
    } catch (error) {
      throw new EthereumError(
        `Could not fetch deployment info for ${contractName} on ${network?.name}`,
      );
    }
  }

  async function getLockedBTCBalance(): Promise<void> {
    try {
      const totalCollateral = fundedVaults.reduce(
        (sum: number, vault: Vault) => sum + vault.collateral,
        0,
      );
      setLockedBTCBalance(Number(totalCollateral.toFixed(5)));
    } catch (error) {
      throwEthereumError(`Could not fetch locked BTC balance: `, error);
    }
  }

  async function getDLCBTCBalance(): Promise<void> {
    try {
      if (!dlcBTCContract) throw new Error("Protocol contract not initialized");
      await dlcBTCContract.callStatic.balanceOf(address);
      const dlcBTCBalance = customShiftValue(
        parseInt(await dlcBTCContract.balanceOf(address)),
        8,
        true,
      );
      setDLCBTCBalance(dlcBTCBalance);
    } catch (error) {
      throwEthereumError(`Could not fetch dlcBTC balance: `, error);
    }
  }

  async function getAllVaults(): Promise<void> {
    try {
      if (!protocolContract)
        throw new Error("Protocol contract not initialized");
      await protocolContract.callStatic.getAllVaultsForAddress(address);
      const vaults: RawVault[] =
        await protocolContract.getAllVaultsForAddress(address);
      const formattedVaults: Vault[] = vaults.map(formatVault);
      store.dispatch(vaultActions.setVaults(formattedVaults));
    } catch (error) {
      throwEthereumError(`Could not fetch vaults: `, error);
    }
  }

  async function getVault(
    vaultUUID: string,
    vaultState: VaultState,
    retryInterval = 5000,
    maxRetries = 10,
  ): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (!protocolContract)
          throw new Error("Protocol contract not initialized");
        const vault: RawVault = await protocolContract.getVault(vaultUUID);
        if (!vault) throw new Error("Vault is undefined");
        if (vault.status !== vaultState)
          throw new Error("Vault is not in the correct state");
        const formattedVault: Vault = formatVault(vault);
        store.dispatch(
          vaultActions.swapVault({ vaultUUID, updatedVault: formattedVault }),
        );
        return;
      } catch (error) {
        console.log(`Error fetching vault ${vaultUUID}. Retrying...`);
      }
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
    throw new EthereumError(
      `Failed to fetch vault ${vaultUUID} after ${maxRetries} retries`,
    );
  }

  async function setupVault(btcDepositAmount: number): Promise<void> {
    try {
      if (!protocolContract)
        throw new Error("Protocol contract not initialized");
      await protocolContract.callStatic.setupVault(btcDepositAmount);
      await protocolContract.setupVault(btcDepositAmount);
    } catch (error: any) {
      throwEthereumError(`Could not setup vault: `, error);
    }
  }

  async function closeVault(vaultUUID: string) {
    try {
      if (!protocolContract)
        throw new Error("Protocol contract not initialized");
      await protocolContract.callStatic.closeVault(vaultUUID);
      await protocolContract.closeVault(vaultUUID);
    } catch (error) {
      throwEthereumError(`Could not close vault: `, error);
    }
  }

  async function recommendTokenToMetamask(): Promise<boolean> {
    try {
      const { ethereum } = window;
      if (!ethereum) return false;
      const response = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: dlcBTCContract?.address,
            symbol: "dlcBTC",
            decimals: 8,
            image:
              "https://cdn.discordapp.com/attachments/994505799902691348/1035507437748367360/DLC.Link_Emoji.png",
          },
        },
      });
      await response.wait();
      return response;
    } catch (error) {
      throwEthereumError(
        `Could not recommend dlcBTC token to MetaMask: `,
        error,
      );
      return false;
    }
  }

  return {
    protocolContract,
    dlcManagerContract,
    dlcBTCContract,
    dlcBTCBalance,
    lockedBTCBalance,
    requestEthereumAccount,
    getAllVaults,
    getVault,
    setupVault,
    closeVault,
    recommendTokenToMetamask,
  };
}
