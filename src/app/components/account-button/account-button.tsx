import { useDispatch } from 'react-redux';

import { Text } from '@chakra-ui/react';

import { modalActions } from '../../store/slices/component/modal.actions';
import { AccountButtonLayout } from './account-button.layout';

export function AccountButton(): React.JSX.Element {
  const dispatch = useDispatch();

  function handleClick(): void {
    dispatch(modalActions.toggleSelectWalletModalVisibility(true));
  }

  return (
    <AccountButtonLayout handleClick={handleClick}>
      <Text>CONNECT WALLET</Text>
    </AccountButtonLayout>
  );
}
