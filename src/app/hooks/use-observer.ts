import { useSelector } from 'react-redux';

import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { UseEthereumReturn } from './use-ethereum';

export function useObserver(ethereum: UseEthereumReturn, dispatch: Dispatch<AnyAction>) {
  const { network } = useSelector((state: RootState) => state.account);
  const { protocolContract, dlcBTCContract, getVault } = ethereum;
  
  if (!protocolContract || !dlcBTCContract) return;

  console.log(`Listening to [${network?.name}]`);
  console.log(`Listening to [${protocolContract.address}]`);
  console.log(`Listening to [${dlcBTCContract.address}]`);

  protocolContract.on('SetupVault', async (...args) => {
    const vaultUUID = args[0];
    const vaultTXHash = args[args.length - 1].transactionHash;
    console.log(`Vault ${vaultUUID} is ready with TX ${vaultTXHash}`);
    await getVault(vaultUUID).then(() => {
      dispatch(mintUnmintActions.setMintStep(1));
    });
  });
}
