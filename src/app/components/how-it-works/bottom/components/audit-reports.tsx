import { HStack, Image, Text } from '@chakra-ui/react';
import { CustomCard } from '@components/how-it-works/components/custom-card';

export function AuditReports(): React.JSX.Element {
  return (
    <CustomCard width={'488px'} height={'152px'} padding={'25px'}>
      {
        <>
          <Text variant={'title'}>Audit Reports</Text>
          <HStack>
            <Image src={'/images/report.png'} width={'34px'} height={'42px'}></Image>
            <Text color={'white'}>
              Coin Fabric: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.
            </Text>
          </HStack>
        </>
      }
    </CustomCard>
  );
}
