import { CustomCard } from './custom-card';
import { FlowStep } from './flow-step';

export function BottomSection(): React.JSX.Element {
  return (
    <CustomCard width="488px" height="970px" padding="25px">
      {
        <>
          <FlowStep
            step={'Step 1'}
            title={'Deposit Adress'}
            content={
              'Select an amount of Bitcoin you would like to lock and confirm it in your Ethereum Wallet. You will receive your deposit token dlcBTC to the same address.'
            }
            hasBadge={false}
          />
          <FlowStep
            step={'Step 2'}
            title={'Lock Bitcoin'}
            content={
              'Confirm the transaction in your Bitcoin Wallet which will lock your Bitcoin on-chain.'
            }
            hasBadge={false}
          />
          <FlowStep
            step={'Step 3'}
            title={'Mint dlcBTC'}
            content={
              'Wait for Bitcoin to get locked on chain (~1 hour). After confirmation dlcBTC tokens will automatically appear in your Ethereum Wallet. You can use dlcBTC in supported DeFi protocols for lending, yield farming, staking and more.'
            }
            hasBadge={false}
          />
        </>
      }
    </CustomCard>
  );
}
