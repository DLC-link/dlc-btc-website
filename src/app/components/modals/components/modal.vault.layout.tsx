import { ReactNode } from 'react';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface ModalVaultLayoutProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function ModalVaultLayout({
  title,
  isOpen,
  onClose,
  children,
}: ModalVaultLayoutProps): React.JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={'450px'}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody w={'100%'}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
