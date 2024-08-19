import React from 'react';
import ThemeModeProvider from './providers/ThemeModeProvider';
import ThemeSchemeProvider from './providers/ThemeSchemeProvider';
import WrapperTheme from './wrapper/WrapperTheme';

interface M3Props {
  children?: React.ReactNode;
}

const M3 = ({ children }: M3Props) => {
  return (
    <ThemeModeProvider>
      <ThemeSchemeProvider>
        <WrapperTheme>{children}</WrapperTheme>
      </ThemeSchemeProvider>
    </ThemeModeProvider>
  );
};

export default M3;
