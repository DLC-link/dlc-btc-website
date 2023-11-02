import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import { ChakraProvider } from '@chakra-ui/react';

import { Home } from './home';
import { store } from './store';
import { appTheme } from './styles/appTheme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <ChakraProvider resetCSS theme={appTheme}>
      <Home />
    </ChakraProvider>
  </ReduxProvider>
);
