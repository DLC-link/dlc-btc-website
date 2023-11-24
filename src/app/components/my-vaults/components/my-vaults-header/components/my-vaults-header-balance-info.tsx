import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { CustomSkeleton } from "@components/custom-skeleton/custom-skeleton";

interface MyVaultsHeaderBalanceInfoProps {
  title: string;
  imageSrc: string;
  altText: string;
  assetAmount?: number;
  showNone?: boolean;
}

export function MyVaultsHeaderBalanceInfo({
  title,
  imageSrc,
  altText,
  assetAmount,
  showNone,
}: MyVaultsHeaderBalanceInfoProps): React.JSX.Element {
  return (
    <VStack justifyContent={"center"} alignItems={"start"} w={"35%"} h={"100%"}>
      <Text color={"accent.cyan.01"} fontWeight={600} fontSize={"md"}>
        {title}
      </Text>
      <HStack>
        <Image src={imageSrc} alt={altText} boxSize={"25px"} />
        {assetAmount !== undefined ? (
          <Text color={"white"} fontWeight={800} fontSize={"xl"}>
            {showNone ? "-" : assetAmount}
          </Text>
        ) : (
          <CustomSkeleton height={"25px"} />
        )}
      </HStack>
    </VStack>
  );
}
