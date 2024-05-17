// import { useContext, useState } from 'react';

// import { LeatherError } from '@models/error-types';
// import { Address, BitcoinNativeSegwitAddress, RpcResponse } from '@models/leather';
// import { BitcoinWalletContext } from '@providers/ledger-context-provider';
// import { P2Ret, p2wpkh } from '@scure/btc-signer';

// import { useEndpoints } from './use-endpoints';
// import { useEthereum } from './use-ethereum';

// export function useLeather() {
//   const {
//     bitcoinNetwork,
//     bitcoinNetworkName,
//     bitcoinBlockchainAPIURL,
//     bitcoinBlockchainAPIFeeURL,
//   } = useEndpoints();
//   const {
//     taprootMultisigAddressInformation,
//     setTaprootMultisigAddressInformation,
//     nativeSegwitAddressInformation,
//     setNativeSegwitAddressInformation,
//     setBitcoinWalletContextState,
//   } = useContext(BitcoinWalletContext);

//   const { getRawVault } = useEthereum();

//   const [isLoading, setIsLoading] = useState<[boolean, string]>([false, '']);

//   /**
//    * Checks if the user's wallet is on the same network as the app.
//    *
//    * @param userNativeSegwitAddress - The user's native segwit address.
//    * @throws BitcoinError - If the user's wallet is not on the same network as the app.
//    */
//   function checkUserWalletNetwork(userNativeSegwitAddress: Address): void {
//     if (bitcoinNetworkName === 'mainnet' && !userNativeSegwitAddress.address.startsWith('bc1')) {
//       throw new LeatherError('User wallet is not on Bitcoin Mainnet');
//     } else if (
//       bitcoinNetworkName === 'testnet' &&
//       !userNativeSegwitAddress.address.startsWith('tb1')
//     ) {
//       throw new LeatherError('User wallet is not on Bitcoin Testnet');
//     } else if (
//       bitcoinNetworkName === 'regtest' &&
//       !userNativeSegwitAddress.address.startsWith('bcrt1')
//     ) {
//       throw new LeatherError('User wallet is not on Bitcoin Regtest');
//     } else {
//       return;
//     }
//   }

//   /**
//    * Fetches the user's native segwit and taproot addresses from the user's wallet. Taproot address is required for the user's public key, which is used in the multisig transaction.
//    * Current implementation is using Leather Wallet.
//    *
//    * @returns A promise that resolves to the user's native segwit and taproot addresses.
//    */
//   async function getBitcoinAddresses(): Promise<Address[]> {
//     try {
//       setIsLoading([true, 'Connecting To Leather Wallet']);
//       const rpcResponse: RpcResponse = await window.btc?.request('getAddresses');
//       const userAddresses = rpcResponse.result.addresses;
//       checkUserWalletNetwork(userAddresses[0]);
//       return userAddresses;
//     } catch (error) {
//       throw new LeatherError(`Error getting bitcoin addresses: ${error}`);
//     }
//   }

//   function getNativeSegwitPayment(nativeSegwitAdress: BitcoinNativeSegwitAddress): P2Ret {
//     return p2wpkh(Buffer.from(nativeSegwitAdress.publicKey), bitcoinNetwork);
//   }

//   function getTaprootMultisi

// }
