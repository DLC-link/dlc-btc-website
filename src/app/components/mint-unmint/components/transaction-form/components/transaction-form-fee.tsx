import { HStack, Text, VStack } from "@chakra-ui/react";

interface TransactionFormFeeProps {
  assetAmount: number;
}

function calculateProtocolFee(
  amount: number,
  protocolFeePercentage: number,
): string {
  return (amount * protocolFeePercentage).toFixed(8);
}

function calculateProtocolFeeInUSD(
  assetAmount: number,
  usdPrice: number,
  protocolFeePercentage: number,
): string {
  return (assetAmount * protocolFeePercentage * usdPrice).toFixed(8);
}

export function TransactionFormFee({
  assetAmount,
}: TransactionFormFeeProps): React.JSX.Element {
  return (
    <VStack
      alignItems={"end"}
      p={"15px"}
      w={"100%"}
      border={"1px solid"}
      borderRadius={"md"}
      borderColor={"border.cyan.01"}
    >
      <HStack justifyContent={"space-between"} w={"100%"}>
        <Text color={"white.02"} fontSize={"sm"}>
          Protocol Fee
        </Text>
        <Text color={"white.01"} fontSize={"sm"} fontWeight={800}>
          {calculateProtocolFee(assetAmount, 0.0001)} BTC
        </Text>{" "}
      </HStack>
      <Text color={"white.01"} fontSize={"sm"}>
        = {calculateProtocolFeeInUSD(assetAmount, 36.142, 0.0001)} $
      </Text>
    </VStack>
  );
}
