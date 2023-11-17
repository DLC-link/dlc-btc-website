import { Button, HStack, Image, Link, Text } from "@chakra-ui/react";
import { TutorialVideo } from "@components/mint-unmint/components/mint/components/video";

interface StepContent {
  title: string;
  blockchain: "ethereum" | "bitcoin";
  primaryBody: React.ReactNode;
  secondaryBody?: React.ReactNode;
  button?: React.ReactNode;
  video?: React.ReactNode;
}

const stepOne: StepContent = {
  title: "Create Vault",
  blockchain: "ethereum",
  primaryBody: (
    <Text color={"white.01"} fontSize={"md"}>
      Select an amount of dlcBTC you would like to mint and confirm it in your{" "}
      <Link
        color={"accent.cyan.01"}
        href="https://ethereum.org/"
        isExternal
        textDecoration={"underline"}
      >
        Ethereum Wallet
      </Link>
      .
    </Text>
  ),
  secondaryBody: (
    <Text color={"white.01"} fontSize={"md"} fontWeight={"bold"}>
      1 BTC = 1 dlcBTC
    </Text>
  ),
  video: <TutorialVideo />,
};

const stepTwo: StepContent = {
  title: "Lock Bitcoin",
  blockchain: "bitcoin",
  primaryBody: (
    <Text color={"white.01"} fontSize={"md"}>
      Confirm the transaction in your{" "}
      <Link
        color={"accent.cyan.01"}
        href="https://ethereum.org/"
        isExternal
        textDecoration={"underline"}
      >
        Bitcoin Wallet{" "}
      </Link>
      which will lock your Bitcoin on-chain.
    </Text>
  ),
};

const stepThree: StepContent = {
  title: "Mint dlcBTC",
  blockchain: "ethereum",
  primaryBody: (
    <Text color={"white.01"} fontSize={"sm"}>
      Wait for Bitcoin to get locked on chain{" "}
      <Link
        color={"accent.cyan.01"}
        href="https://ethereum.org/"
        isExternal
        textDecoration={"underline"}
      >
        (~1 hour)
      </Link>
      . After 6 confirmations, dlcBTC tokens will appear in your Ethereum
      Wallet.
    </Text>
  ),
  secondaryBody: (
    <Text color={"white.01"} fontSize={"sm"}>
      To ensure your <span style={{ fontWeight: "bold" }}>dlcBTC tokens </span>
      are <span style={{ fontWeight: "bold" }}>visible </span>
      simply <span style={{ fontWeight: "bold" }}>add them </span>
      to your Ethereum Wallet.
    </Text>
  ),
  button: (
    <Button variant={"action"}>
      <HStack>
        <Image
          src={"/images/logos/dlc-btc-logo.svg"}
          alt={"dlcBTC"}
          boxSize={"25px"}
        />
        <Text> Add Token to Wallet</Text>
      </HStack>
    </Button>
  ),
};

export const mintStepsContent: StepContent[] = [stepOne, stepTwo, stepThree];
