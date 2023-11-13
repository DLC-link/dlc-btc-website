import { Divider, VStack } from "@chakra-ui/react";
import { easyTruncateAddress } from "@common/utilities";

import { InfoRow } from "./components/vault-box-info-row";
import { TransactionRow } from "./components/vault-box-transaction-row";

interface VaultBoxExpandedInformationStackProps {
  uuid: string;
  fundingTX: string;
  closingTX: string;
  isExpanded: boolean;
}

export function VaultBoxExpandedInformationStack({
  uuid,
  fundingTX,
  closingTX,
  isExpanded,
}: VaultBoxExpandedInformationStackProps): React.JSX.Element | boolean {
  if (!isExpanded) return false;

  return (
    <>
      <Divider w={"100%"} borderStyle={"dashed"} />
      <VStack w={"100%"} justifyContent={"space-between"}>
        <InfoRow label={"UUID"} value={easyTruncateAddress(uuid)} />
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
