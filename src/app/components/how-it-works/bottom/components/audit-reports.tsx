import { HStack, Link, Text } from '@chakra-ui/react';
import { CustomCard } from '@components/how-it-works/components/custom-card';
import { AuditReportIcon } from '@styles/icon';

export function AuditReports(): React.JSX.Element {
  return (
    <CustomCard width={'488px'} height={'170px'} padding={'25px'}>
      {
        <>
          <Text variant={'title'}>Audit Reports</Text>
          <HStack align={'start'} spacing={'15px'}>
            <AuditReportIcon fill={'rgba(50, 201, 247, 1)'} />
            <Text color={'white'}>
              The following is a security audit report, completed by the team at CoinFabrik on
              November 29, 2023.{' '}
              <Link
                href={'https://docs.dlc.link/resources#security-audit-reports'}
                isExternal
                color={'accent.lightBlue.01'}
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
