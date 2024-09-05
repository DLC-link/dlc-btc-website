import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/inter';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import '@fontsource/onest';
import '@fontsource/onest/600.css';
import '@fontsource/onest/800.css';

import { App } from './app/app';
import { store } from './app/store';
import { appTheme } from './styles/app-theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <ChakraProvider
      resetCSS
      theme={appTheme}
      toastOptions={{
        defaultOptions: {
          position: 'bottom',
        },
      }}
    >
      <App />
    </ChakraProvider>
  </ReduxProvider>
);
