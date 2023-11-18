import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";

import { TransactionFee } from "./components/transaction-fee";
import { TransactionInput } from "./components/transaction-input";
import { Warning } from "./components/warning";

interface TransactionFormProps {
  currentStep: number;
}

export interface TransactionFormValues {
  amount: number;
}

export const blockchainFormPropertyMap = {
  ethereum: {
    title: "Amount of dlcBTC you want to mint",
    validateFn: validateTokenAmount,
    buttonText: "Create Vault",
    logo: "/images/logos/dlc-btc-logo.svg",
    alt: "dlcBTC",
    submitFnText:
      "In production your Ethereum Wallet would now open to confirm the transaction",
  },
  bitcoin: {
    title: "Amount of BTC you want to lock",
    validateFn: validateBitcoinAmount,
    buttonText: "Lock Bitcoin",
    logo: "/images/logos/bitcoin-logo.svg",
    alt: "Bitcoin",
    submitFnText:
      "In production your Bitcoin Wallet would now open to confirm the transaction",
  },
};

function validateTokenAmount(value: number): string | undefined {
  let error;
  if (!value) {
    error = "Please enter an amount of dlcBTC you would like to mint";
  } else if (value < 0.0001) {
    error = "You can't mint less than 0.0001 dlcBTC";
  }
  return error;
}

function validateBitcoinAmount(value: number): string | undefined {
  let error;
  if (!value) {
    error = "Please enter an amount of BTC you would like to lock";
  } else if (value < 0.001) {
    error = "You can't lock less than 0.0001 BTC";
  }
  return error;
}

const initialValues: TransactionFormValues = { amount: 0.001 };

export function TransactionForm({
  currentStep,
}: TransactionFormProps): React.JSX.Element | boolean {
  let blockchain: "ethereum" | "bitcoin";

  switch (currentStep) {
    case 0:
      blockchain = "ethereum";
      break;
    case 1:
      blockchain = "bitcoin";
      break;
    default:
      return false;
  }

  return (
    <VStack w={"300px"}>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          alert(blockchainFormPropertyMap[blockchain].submitFnText);
        }}
      >
        {({ handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.amount && touched.amount}>
              <VStack spacing={"15px"} w={"300px"}>
                <Text w={"100%"} color={"accent.cyan.01"}>
                  {blockchainFormPropertyMap[blockchain].title}
                </Text>
                <TransactionInput blockchain={blockchain} values={values} />
                <HStack alignItems={"start"} w={"100%"}>
                  <FormErrorMessage fontSize={"xs"}>
                    {errors.amount}
                  </FormErrorMessage>
                </HStack>
                <Warning blockchain={blockchain} />
                {blockchain === "bitcoin" && (
                  <TransactionFee amount={values.amount} />
                )}
                <Button
                  variant={"account"}
                  type={"submit"}
                  isDisabled={Boolean(errors.amount)}
                >
                  {blockchainFormPropertyMap[blockchain].buttonText}
                </Button>
              </VStack>
            </FormControl>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}
