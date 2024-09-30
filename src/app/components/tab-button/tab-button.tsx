import { Button } from '@chakra-ui/react';

interface TabButtonProps {
  title: string;
  isActive: boolean;
  handleClick: () => void;
}

export function TabButton({ title, isActive, handleClick }: TabButtonProps): React.JSX.Element {
  return (
    <Button
      variant={'tab'}
      opacity={isActive ? '100%' : '50%'}
      borderColor={isActive ? 'accent.lightBlue.01' : 'white.03'}
      onClick={handleClick}
    >
      {title}
    </Button>
  );
}
