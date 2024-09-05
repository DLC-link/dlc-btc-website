import { ReactNode } from 'react';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface SelectWalletModalLayoutProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: string;
  padding?: string;
}

export function ModalLayout({
  title,
  isOpen,
  onClose,
  children,
  variant = 'baseStyle',
  padding = '15px',
}: SelectWalletModalLayoutProps): React.JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant={variant}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding={padding}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}
