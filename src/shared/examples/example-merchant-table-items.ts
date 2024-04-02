import { amber, falconX, galaxy } from '@models/merchant';

// @ts-expect-error: ignoring because of later implementation
const exampleMerchantTableItems = [
  {
    dlcBTCAmount: 15,
    merchant: falconX,
  },
  {
    dlcBTCAmount: 10,
    merchant: amber,
  },
  {
    dlcBTCAmount: 5,
    merchant: galaxy,
  },
];
