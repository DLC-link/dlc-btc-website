import { FormApi, ReactFormApi } from '@tanstack/react-form';

export interface TransactionFormAPI
  extends FormApi<
      {
        assetAmount: string;
      },
      undefined
    >,
    ReactFormApi<
      {
        assetAmount: string;
      },
      undefined
    > {}
