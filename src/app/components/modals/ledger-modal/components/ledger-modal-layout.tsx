import { ReactNode } from 'react';

import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface LedgerModalLayoutProps {
  logo: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function LedgerModalLayout({
  logo,
  isOpen,
  onClose,
  children,
}: LedgerModalLayoutProps): React.JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant={'ledger'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Image src={logo} alt={'Ledger Logo'} width={'150px'} height={'100px'} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
