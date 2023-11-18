import { HStack, Text, VStack } from "@chakra-ui/react";

interface TransactionFeeProps {
  amount: number;
}

function calculateProtocolFee(
  amount: number,
  protocolFeePercentage: number,
): string {
  return (amount * protocolFeePercentage).toFixed(8);
}

function calculateProtocolFeeInUSD(
  amount: number,
  usdPrice: number,
  protocolFeePercentage: number,
): string {
  return (amount * protocolFeePercentage * usdPrice).toFixed(8);
}

export function TransactionFee({
  amount,
}: TransactionFeeProps): React.JSX.Element {
  return (
    <VStack
      alignItems={"end"}
      p={"15px"}
      borderRadius={"md"}
      w={"100%"}
      border={"1px solid"}
      borderColor={"border.cyan.01"}
    >
      <HStack justifyContent={"space-between"} w={"100%"}>
        <Text color={"white.02"} fontSize={"sm"}>
          Protocol Fee
        </Text>
        <Text color={"white.01"} fontSize={"sm"} fontWeight={800}>
          {calculateProtocolFee(amount, 0.0001)} BTC
        </Text>{" "}
      </HStack>
      <Text color={"white.01"} fontSize={"sm"}>
        = {calculateProtocolFeeInUSD(amount, 36.142, 0.0001)} $
      </Text>
    </VStack>
  );
}
