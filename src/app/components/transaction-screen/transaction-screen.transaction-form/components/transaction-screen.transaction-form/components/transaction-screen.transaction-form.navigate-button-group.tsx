import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ButtonGroup } from '@chakra-ui/react';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';

import { TransactionFormNavigateButton } from './transaction-screen.transaction-form.navigate-button';

interface TransactionFormNavigateButtonGroupProps {
  flow: 'mint' | 'burn';
  handleClose?: () => void;
}

export function TransactionFormNavigateButtonGroup({
  flow,
  handleClose,
}: TransactionFormNavigateButtonGroupProps): React.JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleClick() {
    if (flow === 'mint') {
      dispatch(mintUnmintActions.setActiveTab(0));
      dispatch(mintUnmintActions.setMintStep([0, '']));
    } else {
      dispatch(mintUnmintActions.setActiveTab(1));
      dispatch(mintUnmintActions.setUnmintStep([0, '']));
    }
    navigate('/mint-withdraw');
    if (handleClose) {
      handleClose();
    }
  }

  function handleNavigateToMyVaults() {
    navigate('/my-vaults');
    if (handleClose) {
      handleClose();
    }
  }

  return (
    <ButtonGroup w={'100%'} justifyContent={'space-between'}>
      <TransactionFormNavigateButton
        label={flow === 'mint' ? 'Create Another Vault' : 'Withdraw More'}
        onClick={() => handleClick()}
      />
      <TransactionFormNavigateButton
        label={'Show All Vaults'}
        onClick={() => handleNavigateToMyVaults()}
      />
    </ButtonGroup>
  );
}
