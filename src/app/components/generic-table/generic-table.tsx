import { HasChildren } from '@models/has-children';

import { GenericTableLayout } from './components/generic-table-layout';

export function GenericTable({ children }: HasChildren): React.JSX.Element {
  return <GenericTableLayout>{children}</GenericTableLayout>;
}
