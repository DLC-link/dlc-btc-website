import { Divider, VStack } from "@chakra-ui/react";
import { easyTruncateAddress } from "@common/utilities";

import { InformationRow } from "./components/asset-row";
import { TransactionRow } from "./components/transaction-row";

interface VaultCardExpandedInformationStackProps {
  uuid: string;
  fundingTX: string;
  closingTX: string;
  isExpanded: boolean;
}

export function VaultCardExpandedInformationStack({
  uuid,
  fundingTX,
  closingTX,
  isExpanded,
}: VaultCardExpandedInformationStackProps): React.JSX.Element | boolean {
  if (!isExpanded) return false;

  return (
    <>
      <Divider w={"100%"} borderStyle={"dashed"} />
      <VStack w={"100%"} justifyContent={"space-between"}>
        <InformationRow label={"UUID"} value={easyTruncateAddress(uuid)} />
        {fundingTX !== "" && (
          <TransactionRow label={"Funding TX"} value={fundingTX} />
        )}
        {closingTX !== "" && (
          <TransactionRow label={"Closing TX"} value={closingTX} />
        )}
      </VStack>
    </>
  );
}
