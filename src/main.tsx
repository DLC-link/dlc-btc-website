import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import '@fontsource/poppins';

import { ChakraProvider } from '@chakra-ui/react';

import { App } from './app/app';
import { store } from './app/store';
import { appTheme } from './styles/appTheme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <ChakraProvider resetCSS theme={appTheme}>
      <App />
    </ChakraProvider>
  </ReduxProvider>
);
