import { Button, HStack, Stack, Text } from '@chakra-ui/react';
import { SupportedPaymentType } from '@models/supported-payment-types';
import { truncateAddress } from 'dlc-btc-lib/utilities';

interface LedgerModalAddressButtonProps {
  addressInformation: [number, string, number];
  paymentType: SupportedPaymentType;
  setFundingAndTaprootAddress: (index: number, paymentType: SupportedPaymentType) => void;
}

export function LedgerModalAddressButton({
  addressInformation,
  paymentType,
  setFundingAndTaprootAddress,
}: LedgerModalAddressButtonProps): React.JSX.Element {
  const [index, address, balance] = addressInformation;
  return (
    <Button
      variant={'bitcoinAddress'}
      w={'100%'}
      h={'15px'}
      onClick={() => setFundingAndTaprootAddress(index, paymentType)}
    >
      <HStack w={'100%'} justifyContent={'space-between'}>
        <Stack w={'50%'} alignItems={'flex-start'}>
          <Text fontSize={'xs'} fontWeight={'bold'}>
            {truncateAddress(address)}
          </Text>
        </Stack>
        <Stack w={'50%'} alignItems={'flex-end'}>
          <Text fontSize={'xs'}>{balance} BTC</Text>
        </Stack>
      </HStack>
    </Button>
  );
}
