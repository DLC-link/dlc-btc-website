import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/onest';
import '@fontsource/onest/600.css';
import '@fontsource/onest/800.css';
import { PersistGate } from 'redux-persist/integration/react';

import { App } from './app/app';
import { persistor, store } from './app/store';
import { appTheme } from './styles/app-theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <PersistGate persistor={persistor} loading={null}>
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
    </PersistGate>
  </ReduxProvider>
);
