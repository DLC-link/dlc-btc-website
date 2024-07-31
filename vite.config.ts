import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { ViteToml } from 'vite-plugin-toml'
import { readFileSync } from 'fs';
import wasm from 'vite-plugin-wasm';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { supportedEthereumNetworks } from 'dlc-btc-lib/constants';

import { http, createConfig, Config } from 'wagmi'
import { arbitrum, arbitrumSepolia, hardhat, Chain  } from 'wagmi/chains'
import { filter, fromPairs, includes, map, pipe } from 'ramda';
import { HttpTransport } from 'viem';

const SOLIDITY_CONTRACT_URL = 'https://raw.githubusercontent.com/DLC-link/dlc-solidity';
const SUPPORTED_VIEM_CHAINS: Chain[] = [arbitrum, arbitrumSepolia, hardhat];

function getWagmiConfiguration(ethereumNetworkIDs: EthereumNetworkID[]): Config {
  const wagmiChains = filter(
    (chain: Chain) => includes(chain.id, map(Number, ethereumNetworkIDs)),
    SUPPORTED_VIEM_CHAINS
  ) as [Chain, ...Chain[]];

  const wagmiTransports = pipe(
    map((chain: Chain): [number, HttpTransport] => [chain.id, http()]),
    fromPairs
  )(wagmiChains);

  return createConfig({
    chains: wagmiChains, 
    transports: wagmiTransports
  });
}

async function fetchEthereumDeploymentPlans(
  appEnvironment: string,
  branchName: string,
  ethereumNetworkIDs: EthereumNetworkID[],
  localDeploymentFilesURL?: string
): Promise<any[]> {
  const deploymentPlans = await Promise.all(ethereumNetworkIDs.map(async (ethereumNetworkID) => {
    const ethereumNetwork = supportedEthereumNetworks.find(
      network => network.id === ethereumNetworkID
    );

    const networkDeploymentPlans = await Promise.all(['DLCManager', 'DLCBTC'].map(async (contractName) => {
      let deploymentPlanURL: string;
    switch (appEnvironment) {
      case 'mainnet':
      case 'testnet':
      case 'devnet':
        deploymentPlanURL = `${SOLIDITY_CONTRACT_URL}/${branchName}/deploymentFiles/${ethereumNetwork.name.toLowerCase()}/${contractName}.json`;
        break;
      case 'localhost':
        deploymentPlanURL = `${localDeploymentFilesURL}/contracts/localhost/${contractName}.json`;
        break;
      default:
        throw new Error('Invalid App Environment');
    }
      try {
        const response = await fetch(deploymentPlanURL);
        const contractData = await response.json();
        return contractData;
      } catch (error) {
        throw new Error(
          `Could not fetch deployment info for ${contractName} on ${ethereumNetwork.name}`
        );
      }
    }));
    return { name: ethereumNetwork.name, deploymentPlans: networkDeploymentPlans};
  }));

  return deploymentPlans;
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) =>  {

  const env = loadEnv(mode, process.cwd(), '')

  const environmentName = env.VITE_APP_ENVIRONMENT;
  const branchName = env.VITE_ETHEREUM_DEPLOYMENT_BRANCH

  const appConfigurationJSON = readFileSync(resolve(__dirname, `./config.${environmentName}.json`), 'utf-8');
  const appConfiguration = JSON.parse(appConfigurationJSON);
  const enabledEthereumNetworkIDs = appConfiguration.enabledEthereumNetworkIDs;


  appConfiguration.ethereumContractInformations = await fetchEthereumDeploymentPlans(environmentName, branchName, enabledEthereumNetworkIDs);
  appConfiguration.ethereumInfuraWebsocketURL = env.VITE_ARBITRUM_OBSERVER_NODE;
  appConfiguration.wagmiConfiguration = getWagmiConfiguration(enabledEthereumNetworkIDs);
  console.log(appConfiguration);

  return {
  plugins: [react(), wasm(), ViteToml()],
  build: {
    target: 'esnext',
  },
  define: {
    appConfiguration,
  },
  resolve: {
    alias: [
      { 
      find: "@store", 
      replacement: resolve(__dirname, './src/app/store') 
    },
    { 
      find: "@components", 
      replacement: resolve(__dirname, './src/app/components') 
    },
    { 
      find: "@models", 
      replacement: resolve(__dirname, './src/shared/models') 
    },
    {
      find: "@functions",
      replacement: resolve(__dirname, './src/app/functions')
    },
    { 
      find: "@common", 
      replacement: resolve(__dirname, './src/app/common') 
    },
    { 
      find: "@pages", 
      replacement: resolve(__dirname, './src/app/pages') 
    },
    { 
      find: "@shared", 
      replacement: resolve(__dirname, './src/shared') 
    },
    { 
      find: "@hooks", 
      replacement: resolve(__dirname, './src/app/hooks') 
    },
    { 
      find: "@providers", 
      replacement: resolve(__dirname, './src/app/providers') 
    },
    { 
      find: "@styles", 
      replacement: resolve(__dirname, './src/styles') 
    }]
  }
}
})
