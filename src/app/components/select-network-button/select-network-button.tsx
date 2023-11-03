import { useDispatch, useSelector } from 'react-redux';

import { Box, Select } from '@chakra-ui/react';

import { Network } from '../../../shared/models/network';
import { RootState } from '../../store';
import { accountActions } from '../../store/slices/account/account.actions';

interface SelectNetworkProps {
  networks: Network[];
  size?: string;
}

export function SelectNetworkButton({ networks, size }: SelectNetworkProps): React.JSX.Element {
  const dispatch = useDispatch();
  const { network } = useSelector((state: RootState) => state.account);
  
  return (
    <Box width={'200px'}>
      <Select
        size={size ? size : 'md'}
        placeholder="Select Network"
        {...(network && { defaultValue: network })}
      >
        {networks.map((network, idx) => {
          return (
            <option
              key={`network-${idx}`}
              onClick={() => {
                dispatch(accountActions.setNetwork(network.id));
              }}
            >
              {network.name}
            </option>
          );
        })}
      </Select>
    </Box>
  );
}
