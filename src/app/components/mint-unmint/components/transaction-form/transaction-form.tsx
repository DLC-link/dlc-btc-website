import {
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

import { TransactionFee } from "./components/transaction-fee";
import { Warning } from "./components/warning";

interface TransactionFormValues {
  amount: number;
}

interface TransactionFormProps {
  blockchain: "ethereum" | "bitcoin";
}

const blockchainFormPropertyMap = {
  ethereum: {
    title: "Amount of dlcBTC you want to mint",
    validateFn: validateDlcBtcAmount,
    buttonText: "Create Vault",
    logo: "/images/logos/dlc-btc-logo.svg",
    alt: "dlcBTC",
    submitFnText:
      "In production your Ethereum Wallet would now open to confirm the transaction",
  },
  bitcoin: {
    title: "Amount of BTC you want to lock",
    validateFn: validateBtcAmount,
    buttonText: "Lock Bitcoin",
    logo: "/images/logos/bitcoin-logo.svg",
    alt: "Bitcoin",
    submitFnText:
      "In production your Bitcoin Wallet would now open to confirm the transaction",
  },
};

function validateDlcBtcAmount(value: number) {
  let error;
  if (!value) {
    error = "Please enter an amount of dlcBTC you would like to mint";
  } else if (value < 0.0001) {
    error = "You can't mint less than 0.0001 dlcBTC";
  }
  return error;
}

function validateBtcAmount(value: number) {
  let error;
  if (!value) {
    error = "Please enter an amount of BTC you would like to lock";
  } else if (value < 0.001) {
    error = "You can't lock less than 0.0001 BTC";
  }
  return error;
}

export function TransactionForm({
  blockchain,
}: TransactionFormProps): React.JSX.Element {
  const initialValues: TransactionFormValues = { amount: 0.001 };

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
                      as={Input}
                      id="amount"
                      name="amount"
                      type="number"
                      px={"1.5px"}
                      h={"25px"}
                      w={"80px"}
                      focusBorderColor="rgba(7,232,216,1)"
                      fontSize={"xl"}
                      fontWeight={"bold"}
                      validate={
                        blockchainFormPropertyMap[blockchain].validateFn
                      }
                    />
                    <Text fontSize={"xl"}>dlcBTC</Text>
                  </HStack>
                  <Text pl={"30px"} color={"gray"} fontSize={"sm"}>
                    = ~{(values.amount * 36131.1).toFixed(4)}$
                  </Text>
                </VStack>
                <HStack alignItems={"start"} w={"100%"}>
                  <FormErrorMessage fontSize={"xs"}>
                    {errors.amount}
                  </FormErrorMessage>
                </HStack>
                {blockchain === "ethereum" && <Warning />}
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
