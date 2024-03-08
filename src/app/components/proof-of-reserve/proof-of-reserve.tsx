import { useEffect, useState } from 'react';

import { Text, VStack } from '@chakra-ui/react';

import { ProofOfReserveLayout } from './components/proof-of-reserve-layout';

export function ProofOfReserve(): React.JSX.Element {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('http://localhost:8811/get-proof-of-reserve')
      .then(response => response.json())
      .then(data => {
        setContent(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  return (
    <ProofOfReserveLayout>
      {
        <VStack spacing={'10px'}>
          <Text color={'white'}>BTC Reserve</Text>
          <Text color={'white'}>{content}</Text>
        </VStack>
      }
    </ProofOfReserveLayout>
  );
}
