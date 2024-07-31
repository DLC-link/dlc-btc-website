import { Button, Image, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';

export function JasperModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  return (
    <ModalLayout title="" isOpen={isOpen} onClose={() => handleClose()}>
      <VStack alignItems={'start'} spacing={'25px'}>
        <Image src={'/images/logos/jasper-vault-logo.svg'} alt={'Jasper Vault Logo'} />
        <Text color={'accent.lightBlue.01'} fontSize={'xl'} fontWeight={800}>
          Jasper Vault Points Update
        </Text>
        <Text color={'white.02'}>
          Your Jasper Vault points are safe and will appear soon. We’ll ensure everything is updated
          retroactively. Thank you for your patience!
        </Text>
        <Button variant={'account'} onClick={() => handleClose()}>
          Continue to Points
        </Button>
      </VStack>
    </ModalLayout>
  );
}
