import { Button, Image, Text, VStack } from '@chakra-ui/react';
import { ModalComponentProps } from '@components/modals/components/modal-container';
import { ModalLayout } from '@components/modals/components/modal.layout';

export function JasperModal({ isOpen, handleClose }: ModalComponentProps): React.JSX.Element {
  return (
    <ModalLayout title="" isOpen={isOpen} onClose={() => handleClose()}>
      <VStack alignItems={'start'} spacing={'25px'}>
        <Image src={'/images/logos/jasper-vault-logo.svg'} alt={'Jasper Vault Logo'} />
        <Text color={'accent.lightBlue.01'} fontSize={'md'} fontWeight={800}>
          Coming Soon: Jasper Vault Points!
        </Text>
        <Text color={'white.02'}>
          We are happy to be partnering with Jasper Vault! All Jasper Vault points will appear here
          soon and will be calculated retroactively.
        </Text>
        <Button variant={'account'} onClick={() => handleClose()}>
          Continue to Points
        </Button>
      </VStack>
    </ModalLayout>
  );
}
