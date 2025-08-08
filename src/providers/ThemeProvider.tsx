import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, theme } from 'antd';
import { merge } from 'lodash';
import { FC, PropsWithChildren, useLayoutEffect, useMemo } from 'react';

import { useColorMode } from '~/hooks/useColorMode';
import { darkToken, defaultToken, lightToken } from '~/theme/tokens';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { resolvedColorMode, isDarkMode } = useColorMode();

  useLayoutEffect(() => {
    const htmlElement = document.documentElement;

    htmlElement.classList.remove('light', 'dark');
    htmlElement.classList.add(resolvedColorMode);
  }, [resolvedColorMode]);

  const token = useMemo(
    () => merge(defaultToken, isDarkMode ? darkToken : lightToken),
    [isDarkMode],
  );

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{ algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm, token }}>
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
};

export { ThemeProvider };
