// import { useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@chakra-ui/react";
// import { VaultsListGroupBlankContainer } from "@components/vaults-list/components/vaults-list-group-blank-container";
// import { VaultsList } from "@components/vaults-list/vaults-list";
// import { useVaults } from "@hooks/use-vaults";

// import { BlockchainContext } from "../../providers/blockchain-context-provider";
// import { VaultsListGroupContainer } from "../vaults-list/components/vaults-list-group-container";
// import { MyVaultsSmallLayout } from "./components/my-vaults-small.layout";

// interface MyVaultsSmallProps {
//   address?: string;
// }

// export function MyVaultsSmall({
//   address,
// }: MyVaultsSmallProps): React.JSX.Element {
//   const navigate = useNavigate();
//   const {
//     readyVaults,
//     fundingVaults,
//     fundedVaults,
//     closingVaults,
//     closedVaults,
//   } = useVaults();
//   const blockchainContext = useContext(BlockchainContext);
//   const ethereum = blockchainContext?.ethereum;

//   useEffect(() => {
//     async function getVaults() {
//       if (address) {
//         await ethereum?.getAllVaults();
//       }
//     }
//     getVaults();
//   }, [address]);

//   return (
//     <MyVaultsSmallLayout>
//       <VaultsList title={"My Vaults"} height={"545px"} isScrollable={!address}>
//         {address ? (
//           <>
//             <VaultsListGroupContainer label="Lock BTC" vaults={readyVaults} />
//             <VaultsListGroupContainer
//               label="Locking BTC in Progress"
//               vaults={fundingVaults}
//             />
//             <VaultsListGroupContainer
//               label="Unlocking BTC in Progress"
//               vaults={closingVaults}
//             />
//             <VaultsListGroupContainer
//               label="Minted dlcBTC"
//               vaults={fundedVaults}
//             />
//             <VaultsListGroupContainer
//               label="Closed Vaults"
//               vaults={closedVaults}
//             />
//           </>
//         ) : (
//           <VaultsListGroupBlankContainer />
//         )}
//       </VaultsList>
//       <Button variant={"navigate"} onClick={() => navigate("/my-vaults")}>
//         Show All
//       </Button>
//     </MyVaultsSmallLayout>
//   );
// }
