import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { customShiftValue } from "@common/utilities";
import { EthereumNetwork, Network, ethereumNetworks } from "@models/network";
import { RawVault, Vault } from "@models/vault";
import { RootState, store } from "@store/index";
import { accountActions } from "@store/slices/account/account.actions";
import { vaultActions } from "@store/slices/vault/vault.actions";
import { Contract, Signer, ethers } from "ethers";

import { useVaults } from "./use-vaults";

export interface UseEthereumReturn {
  protocolContract: Contract | undefined;
  dlcManagerContract: Contract | undefined;
  dlcBTCContract: Contract | undefined;
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
  getEthereumNetworkConfig: () => {
    walletURL: string;
    explorerAPIURL: string;
  };
  requestEthereumAccount: (network: Network) => Promise<void>;
  getAllVaults: () => Promise<void>;
  getVault: (vaultUUID: string) => Promise<void>;
  setupVault: (btcDepositAmount: number) => Promise<void>;
  closeVault: (vaultUUID: string) => Promise<void>;
}

export function useEthereum(): UseEthereumReturn {
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
    if (!address) return;

    const fetchBalance = async () => {
      try {
        await getDLCBTCBalance();
        await getLockedBTCBalance();
      } catch (error) {
        console.error(error);
      }
    };

    fetchBalance();
  }, [address, fundedVaults, getDLCBTCBalance, getLockedBTCBalance]);

  function formatVault(vault: any): Vault {
    return {
      uuid: vault.uuid,
      collateral: customShiftValue(parseInt(vault.valueLocked), 8, true),
      state: vault.status,
      fundingTX: vault.fundingTransaction,
      closingTX: vault.closingTransaction,
      timestamp: parseInt(vault.timestamp),
    };
  }

  async function setupEthereumConfiguration(network: Network): Promise<void> {
    const { walletNetworkChainID, signer } = await getEthereumProvider(network);
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
      }
      return { walletNetworkChainID, signer };
    } catch (error) {
      throw new Error(`Could not connect to Ethereum: ${error}`);
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
      throw new Error(`Could not connect to Ethereum: ${error}`);
    }
  }

  async function fetchEthereumDeploymentPlan(
    contractName: string,
    chainID: string,
  ) {
    const network = ethereumNetworks.find((network) => network.id === chainID);

    const branchName = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_BRANCH;
    const contractVersion = import.meta.env.VITE_ETHEREUM_DEPLOYMENT_VERSION;
    const deploymentPlanURL = `https://raw.githubusercontent.com/DLC-link/dlc-solidity/${branchName}/deploymentFiles/${network?.name}/v${contractVersion}/${contractName}.json`;

    console.log(
      `Fetching deployment info for ${contractName} on ${network?.name} from dlc-solidity/${branchName}`,
    );

    try {
      const response = await fetch(deploymentPlanURL);
      const contractData = await response.json();
      return contractData;
    } catch (error) {
      throw new Error(
        `Could not fetch deployment info for ${contractName} on ${network?.name}`,
      );
    }
  }

  function getEthereumNetworkConfig(): {
    walletURL: string;
    explorerAPIURL: string;
  } {
    switch (network?.id) {
      case EthereumNetwork.Sepolia:
        return {
          walletURL: "https://devnet.dlc.link/eth-wallet",
          explorerAPIURL: "https://sepolia.etherscan.io/tx/",
        };
      case EthereumNetwork.Goerli:
        return {
          walletURL: "https://testnet.dlc.link/eth-wallet",
          explorerAPIURL: "https://goerli.etherscan.io/tx/",
        };
      default:
        throw new Error(`Unsupported network: ${network?.name}`);
    }
  }

  async function getLockedBTCBalance(): Promise<void> {
    try {
      const totalCollateral = fundedVaults.reduce(
        (sum: number, vault: Vault) => sum + vault.collateral,
        0,
      );
      setLockedBTCBalance(totalCollateral);
    } catch (error) {
      throw new Error(`Could not fetch BTC balance: ${error}`);
    }
  }

  async function getDLCBTCBalance(): Promise<void> {
    try {
      if (!dlcBTCContract) throw new Error("Protocol contract not initialized");
      setDLCBTCBalance(parseInt(await dlcBTCContract.balanceOf(address)));
    } catch (error) {
      throw new Error(`Could not fetch BTC balance: ${error}`);
    }
  }

  async function getAllVaults(): Promise<void> {
    try {
      if (!protocolContract)
        throw new Error("Protocol contract not initialized");
      const vaults: RawVault[] =
        await protocolContract.getAllVaultsForAddress(address);
      const formattedVaults: Vault[] = vaults.map(formatVault);
      store.dispatch(vaultActions.setVaults(formattedVaults));
    } catch (error) {
      throw new Error(`Could not fetch vaults: ${error}`);
    }
  }

  async function getVault(vaultUUID: string): Promise<void> {
    try {
      if (!protocolContract)
        throw new Error("Protocol contract not initialized");
      const vault: RawVault = await protocolContract.getVault(vaultUUID);
      const formattedVault: Vault = formatVault(vault);
      store.dispatch(
        vaultActions.swapVault({ vaultUUID, updatedVault: formattedVault }),
      );
    } catch (error) {
      throw new Error(`Could not fetch vault: ${error}`);
    }
  }

  async function setupVault(btcDepositAmount: number): Promise<void> {
    try {
      if (!protocolContract)
        throw new Error("Protocol contract not initialized");
      const response = await protocolContract.setupVault(btcDepositAmount);
      console.log(response);
    } catch (error) {
      throw new Error(`Could not setup vault: ${error}`);
    }
  }

  async function closeVault(vaultUUID: string) {
    try {
      if (!protocolContract)
        throw new Error("Protocol contract not initialized");
      const response = await protocolContract.closeVault(vaultUUID);
      console.log(response);
    } catch (error) {
      throw new Error(`Could not close vault: ${error}`);
    }
  }

  return {
    protocolContract,
    dlcManagerContract,
    dlcBTCContract,
    dlcBTCBalance,
    lockedBTCBalance,
    requestEthereumAccount,
    getEthereumNetworkConfig,
    getAllVaults,
    getVault,
    setupVault,
    closeVault,
  };
}
