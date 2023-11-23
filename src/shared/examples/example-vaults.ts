import { Vault, VaultState } from "@models/vault";

export const exampleVaults: Vault[] = [
  {
    uuid: "0x123456qwe",
    collateral: 0.5,
    state: VaultState.READY,
    fundingTX: "",
    closingTX: "",
  },
  {
    uuid: "0x123456rty",
    collateral: 1.5,
    state: VaultState.READY,
    fundingTX: "",
    closingTX: "",
  },
  {
    uuid: "0x123456uio",
    collateral: 2.5,
    state: VaultState.FUNDING,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456pas",
    collateral: 3.5,
    state: VaultState.FUNDING,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456dfg",
    collateral: 2.5,
    state: VaultState.FUNDED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456hjk",
    collateral: 3.5,
    state: VaultState.FUNDED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456dfe",
    collateral: 2.5,
    state: VaultState.FUNDED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456hjq",
    collateral: 3.5,
    state: VaultState.FUNDED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456dfh",
    collateral: 2.5,
    state: VaultState.FUNDED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456hjl",
    collateral: 3.5,
    state: VaultState.FUNDED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX: "",
  },
  {
    uuid: "0x123456lzc",
    collateral: 4.5,
    state: VaultState.CLOSING,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
  {
    uuid: "0x123456cvb",
    collateral: 5.5,
    state: VaultState.CLOSING,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
  {
    uuid: "0x123456nmq",
    collateral: 6.5,
    state: VaultState.CLOSED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
  {
    uuid: "0x123456pgh",
    collateral: 7.5,
    state: VaultState.CLOSED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
  {
    uuid: "0x123456skf",
    collateral: 8.5,
    state: VaultState.CLOSED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
  {
    uuid: "0x123456lkh",
    collateral: 9.5,
    state: VaultState.CLOSED,
    fundingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
    closingTX:
      "https://etherscan.io/tx/0xbaf374be66066812e30e428ac5a3bc8d76f8cbc9ed66e3afce68905c183d22b6",
  },
];
