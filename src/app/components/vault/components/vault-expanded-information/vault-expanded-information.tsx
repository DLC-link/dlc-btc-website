import { Divider, ScaleFade, Stack, VStack } from "@chakra-ui/react";
import { easyTruncateAddress } from "@common/utilities";

import { VaultExpandedInformationRow } from "./components/vault-expanded-information-row";
import { VaultExpandedInformationTransactionRow } from "./components/vault-expanded-information-transaction-row";

interface VaultExpandedInformationProps {
  uuid: string;
  fundingTX: string;
  closingTX: string;
  isExpanded: boolean;
}

export function VaultExpandedInformation({
  uuid,
  fundingTX,
  closingTX,
  isExpanded,
}: VaultExpandedInformationProps): React.JSX.Element {
  return (
    <Stack w={"100%"}>
      <ScaleFade in={isExpanded} unmountOnExit>
        <VStack>
          <Divider w={"100%"} borderStyle={"dashed"} />
          <VStack w={"100%"} justifyContent={"space-between"}>
            <VaultExpandedInformationRow
              label={"UUID"}
              value={easyTruncateAddress(uuid)}
            />
            {Boolean(fundingTX) && (
              <VaultExpandedInformationTransactionRow
                label={"Funding TX"}
                value={fundingTX}
              />
            )}
            {Boolean(closingTX) && (
              <VaultExpandedInformationTransactionRow
                label={"Closing TX"}
                value={closingTX}
              />
            )}
          </VStack>
        </VStack>
      </ScaleFade>
    </Stack>
  );
}
