import { HStack, Image, Input, Text, VStack } from "@chakra-ui/react";
import { Field } from "formik";
import {
  TransactionFormValues,
  blockchainFormPropertyMap,
} from "../transaction-form";

interface TransactionInputProps {
  blockchain: "ethereum" | "bitcoin";
  values: TransactionFormValues;
}

export function TransactionInput({
  blockchain,
  values,
}: TransactionInputProps): React.JSX.Element {
  return (
    <VStack
      alignItems={"start"}
      py={"5px"}
      px={"15px"}
      w={"100%"}
      bgColor={"white.01"}
      border={"2.5px solid"}
      borderRadius={"md"}
      borderColor={"border.cyan.01"}
    >
      <HStack>
        <Image
          src={blockchainFormPropertyMap[blockchain].logo}
          alt={blockchainFormPropertyMap[blockchain].alt}
          boxSize={"20px"}
        />
        <Field
          autoFocus
          name="amount"
          as={Input}
          type="number"
          px={"1.5px"}
          h={"25px"}
          w={"75px"}
          focusBorderColor="rgba(7,232,216,1)"
          fontSize={"xl"}
          fontWeight={800}
          validate={blockchainFormPropertyMap[blockchain].validateFn}
        />
        <Text fontSize={"xl"}>dlcBTC</Text>
      </HStack>
      <Text pl={"30px"} color={"gray"} fontSize={"sm"}>
        = ~{(values.amount * 36131.1).toFixed(4)}$
      </Text>
    </VStack>
  );
}
