import { Vault, VaultStatus } from "@models/vault";

export const exampleVaults: Vault[] = [
  {
    uuid: "0x123456789",
    collateral: 0.5,
    state: VaultStatus.READY,
    fundingTX: "",
    closingTX: "",
  },
  {
    uuid: "0x123456789",
    collateral: 1.5,
    state: VaultStatus.READY,
    fundingTX: "",
    closingTX: "",
  },
  {
    uuid: "0x123456789",
    collateral: 2.5,
    state: VaultStatus.FUNDING,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456789",
    collateral: 3.5,
    state: VaultStatus.FUNDING,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456789",
    collateral: 2.5,
    state: VaultStatus.FUNDED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456789",
    collateral: 3.5,
    state: VaultStatus.FUNDED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456789",
    collateral: 4.5,
    state: VaultStatus.CLOSING,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
  {
    uuid: "0x123456789",
    collateral: 5.5,
    state: VaultStatus.CLOSING,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
  {
    uuid: "0x123456789",
    collateral: 6.5,
    state: VaultStatus.CLOSED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
  {
    uuid: "0x123456789",
    collateral: 7.5,
    state: VaultStatus.CLOSED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
];
