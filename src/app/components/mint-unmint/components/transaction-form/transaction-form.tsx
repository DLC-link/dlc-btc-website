import {
  Button,
  FormControl,
  FormErrorMessage,
  Text,
  VStack,
} from "@chakra-ui/react";
import { VaultCard } from "@components/vault/vault-card";
import { useVaults } from "@hooks/use-vaults";
import { Form, Formik } from "formik";

import { TransactionFormFee } from "./components/transaction-form-fee";
import { TransactionFormInput } from "./components/transaction-form-input";
import { TransactionFormWarning } from "./components/transaction-form-warning";

interface TransactionFormProps {
  currentStep: number;
}

export interface TransactionFormValues {
  amount: number;
}

const blockchainFormPropertyMap = {
  ethereum: {
    title: "Amount of dlcBTC you want to mint",
    buttonText: "Create Vault",
    logo: "/images/logos/dlc-btc-logo.svg",
    alt: "dlcBTC",
    submitFnText:
      "In production your Ethereum Wallet would now open to confirm the transaction",
  },
  bitcoin: {
    title: "Amount of BTC you will lock",
    buttonText: "Lock Bitcoin",
    logo: "/images/logos/bitcoin-logo.svg",
    alt: "Bitcoin",
    submitFnText:
      "In production your Bitcoin Wallet would now open to confirm the transaction",
  },
};

const initialValues: TransactionFormValues = { amount: 0.001 };

export function TransactionForm({
  currentStep,
}: TransactionFormProps): React.JSX.Element {
  const { readyVaults } = useVaults();
  const exampleVault = readyVaults[0];

  let blockchain: "ethereum" | "bitcoin";

  switch (currentStep) {
    case 0:
      blockchain = "ethereum";
      break;
    case 1:
      blockchain = "bitcoin";
      break;
    default:
      return <></>;
  }

  //TODO: Separate the bitcoin and ethereum cases into two separate functions

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
                {blockchain === "ethereum" ? (
                  <TransactionFormInput values={values} />
                ) : (
                  <VaultCard vault={exampleVault} isSelectable isSelected />
                )}
                {["ethereum"].includes(blockchain) && (
                  <FormErrorMessage fontSize={"xs"}>
                    {errors.amount}
                  </FormErrorMessage>
                )}
                {["ethereum"].includes(blockchain) && (
                  <TransactionFormWarning assetAmount={values.amount} />
                )}
                {["bitcoin"].includes(blockchain) && (
                  <TransactionFormFee assetAmount={values.amount} />
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
