import { FC, PropsWithChildren } from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { ThemeProvider } from '~/providers/ThemeProvider';
import store from '~/store';

const RootProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <StoreProvider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </StoreProvider>
    </>
  );
};

export { RootProvider };
