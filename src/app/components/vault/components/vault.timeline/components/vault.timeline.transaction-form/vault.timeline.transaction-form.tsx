import { HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import { useForm } from '@tanstack/react-form';

interface VaultTransactionFormProps {
  label: string;
  assetLogo: string;
  currentBitcoinPrice: number;
}

export function VaultTransactionForm({
  label,
  assetLogo,
  currentBitcoinPrice,
}: VaultTransactionFormProps): React.JSX.Element {
  const form = useForm({
    defaultValues: {
      assetAmount: 0.01,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field name={'assetAmount'}>
        {field => (
          <VStack
            w={'100%'}
            p={'15px'}
            bg={'white.04'}
            border={'1px solid'}
            borderColor={'white.03'}
            borderRadius={'md'}
          >
            <Text w={'100%'} fontWeight={'bold'} color={'accent.lightBlue.01'}>
              {label}
            </Text>
            <HStack w={'100%'} justifyContent={'space-between'}>
              <HStack w={'65%'}>
                <Image src={assetLogo} alt={'Asset Logo'} boxSize={'25px'} />
                <Input
                  autoFocus
                  h={'25px'}
                  type={'number'}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  borderColor={'white.01'}
                  _focusVisible={{ borderColor: 'accent.lightBlue.01' }}
                  onChange={e => field.handleChange(e.target.valueAsNumber)}
                  onWheel={(e: React.WheelEvent<HTMLInputElement>) =>
                    (e.target as HTMLInputElement).blur()
                  }
                />
              </HStack>
              <Text fontSize={'sm'} fontWeight={'bold'} color={'white.01'}>
                dlcBTC
              </Text>
            </HStack>
            <Text w={'100%'} pl={'12.5%'} color={'white.02'} fontSize={'xs'}>
              {`~ $${Math.floor(field.state.value * currentBitcoinPrice).toLocaleString('en-US')} USD`}
            </Text>
          </VStack>
        )}
      </form.Field>
    </form>
  );
}
