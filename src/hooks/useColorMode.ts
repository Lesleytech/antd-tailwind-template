import { useAppSelector } from '~/hooks/useAppSelector';
import { useMediaQuery } from '~/hooks/useMediaQuery';

export function useColorMode() {
  const colorMode = useAppSelector((state) => state.ui.colorMode);
  const isSystemDark = useMediaQuery('(prefers-color-scheme: dark)');

  const isSystem = colorMode === 'system';
  const resolvedColorMode = isSystem ? (isSystemDark ? 'dark' : 'light') : colorMode;
  const isLightMode = resolvedColorMode === 'light';
  const isDarkMode = resolvedColorMode === 'dark';

  return {
    colorMode,
    resolvedColorMode,
    isLightMode,
    isDarkMode,
    isSystem,
  };
}
