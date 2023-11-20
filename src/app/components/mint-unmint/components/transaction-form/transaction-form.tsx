import {
  Button,
  FormControl,
  FormErrorMessage,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";

import { TransactionFormInput } from "./components/transaction-form-input";
import { TransactionFormWarning } from "./components/transaction-form-warning";

export interface TransactionFormValues {
  amount: number;
}

const initialValues: TransactionFormValues = { amount: 0.001 };

export function TransactionForm(): React.JSX.Element {
  return (
    <VStack w={"300px"}>
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          alert(
            "In production your Ethereum Wallet would now open to confirm the transaction",
          );
        }}
      >
        {({ handleSubmit, errors, touched, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.amount && touched.amount}>
              <VStack spacing={"15px"} w={"300px"}>
                <Text w={"100%"} color={"accent.cyan.01"}>
                  Amount of dlcBTC you want to mint:
                </Text>
                <TransactionFormInput values={values} />
                <FormErrorMessage fontSize={"xs"}>
                  {errors.amount}
                </FormErrorMessage>
                <TransactionFormWarning assetAmount={values.amount} />
                <Button
                  variant={"account"}
                  type={"submit"}
                  isDisabled={Boolean(errors.amount)}
                >
                  Create Vault
                </Button>
              </VStack>
            </FormControl>
          </Form>
        )}
      </Formik>
    </VStack>
  );
}
