import { HStack, Image, Link, Text } from '@chakra-ui/react';
import { CustomCard } from '@components/how-it-works/components/custom-card';

export function AuditReports(): React.JSX.Element {
  return (
    <CustomCard width={'488px'} height={'170px'} padding={'25px'}>
      {
        <>
          <Text variant={'title'}>Audit Reports</Text>
          <HStack align={'start'} spacing={'15px'}>
            <Image src={'/images/report.png'} w={'34px'} h={'42px'} pt={'5px'}></Image>
            <Text color={'white'}>
              The following is a security audit report, completed by the team at CoinFabrik on
              November 29, 2023.{' '}
              <Link
                href={'https://docs.dlc.link/resources#security-audit-reports'}
                isExternal
                color={'accent.cyan.01'}
              >
                Read the report...
              </Link>
            </Text>
          </HStack>
        </>
      }
    </CustomCard>
  );
}
