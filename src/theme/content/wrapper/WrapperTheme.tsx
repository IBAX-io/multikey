import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { langLocale } from '@/store/lang';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import * as locales from '@mui/material/locale';
import { deepmerge } from '@mui/utils';
import React, { useContext, useEffect, useMemo } from 'react';
import { ThemeModeContext } from '../providers/ThemeModeProvider';
import { ThemeSchemeContext } from '../providers/ThemeSchemeProvider';
import { getMUIComponents } from '../utils/getMUIComponents';
import { getMUIPalette } from '../utils/getMUIPalette';

interface ThemeProps {
  children?: React.ReactNode;
}
const WrapperTheme = ({ children }: ThemeProps) => {
  const locale = useAppSelector(langLocale);
  const dispatch = useAppDispatch();
  const { themeMode } = useContext(ThemeModeContext);
  const { themeScheme } = useContext(ThemeSchemeContext);
  const m3Theme = useMemo(() => {
    const muiPalette = getMUIPalette(themeMode, themeScheme);
    // eslint-disable-next-line import/namespace
    let theme = createTheme(muiPalette, locales[locale]);
    theme = deepmerge(theme, getMUIComponents(theme));
    return theme;
  }, [locale, themeMode, themeScheme]);
  useEffect(() => {
    const arr = ['arSA', 'arSA'];
    const isBoo = arr.includes(locale);
    const dir = isBoo ? 'rtl' : 'ltl';
    document.getElementsByTagName('html')[0].setAttribute('dir', dir);
  }, [dispatch, locale]);
  return (
    <ThemeProvider theme={m3Theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};

export default WrapperTheme;
