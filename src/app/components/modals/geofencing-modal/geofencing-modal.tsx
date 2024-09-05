import { Button, Image, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';

export function GeofencingModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  return (
    <ModalLayout
      title=""
      isOpen={isOpen}
      onClose={() => handleClose()}
      variant={'geofencing'}
      padding={'15px 0px'}
    >
      <VStack alignItems={'center'} spacing={'20px'}>
        <Image src={'/images/logos/geofencing-logo.svg'} alt={'dlcBTC Geofencing Logo'} />

        <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={800}>
          Limited Access in Your Region
        </Text>
        <VStack alignItems={'start'} spacing={'15px'}>
          <Text color={'white.02'}>It looks like dlcBTC isn’t available in your region.</Text>
          <Text color={'white.02'}>
            Countries where access is restricted include the USA, Belarus, Cuba, Democratic People’s
            Republic of Korea (DPRK), Democratic Republic of Congo, Iran, Iraq, Lebanon, Libya,
            Mali, Myanmar, Nicaragua, Somalia, South Sudan, Sudan, and Syria.
          </Text>
          <Text color={'white.02'}>Thank you for understanding!</Text>
        </VStack>

        <Button variant={'account'} onClick={() => handleClose()}>
          Continue to dlcBTC Website
        </Button>
      </VStack>
    </ModalLayout>
  );
}
