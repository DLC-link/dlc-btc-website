import React, { createContext, useState } from 'react';

import { HasChildren } from '@models/has-children';

interface NetworkConfigurationContext {
  networkType: 'evm' | 'xrpl';
  setNetworkType: (networkType: 'evm' | 'xrpl') => void;
}
export const NetworkConfigurationContext = createContext<NetworkConfigurationContext>({
  networkType: 'evm',
  setNetworkType: () => {},
});

export function NetworkConfigurationContextProvider({ children }: HasChildren): React.JSX.Element {
  const [networkType, setNetworkType] = useState<'evm' | 'xrpl'>('evm');

  return (
    <NetworkConfigurationContext.Provider
      value={{
        networkType,
        setNetworkType,
      }}
    >
      {children}
    </NetworkConfigurationContext.Provider>
  );
}
