import { ColorMode } from '~/lib/types/colorMode';

export function getResolvedColorMode(colorMode: ColorMode) {
  if (colorMode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return colorMode;
}
