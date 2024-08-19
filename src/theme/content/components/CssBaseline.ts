import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';

interface CssBaselineType {
  MuiCssBaseline: {
    defaultProps?: ComponentsProps['MuiCssBaseline'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiCssBaseline'];
    variants?: ComponentsVariants['MuiCssBaseline'];
  };
}

export const getCssBaseline = (theme: Theme): CssBaselineType => {
  const { palette } = theme;
  return {
    MuiCssBaseline: {
      defaultProps: {
        enableColorScheme: true
      },
      styleOverrides: {
        body: {
          color: palette.container.contrastText,
          backgroundColor: palette.onBody.main,
          fontWeight: 400,
          fontFamily: ['Inter', 'sans-serif'].join(',')
        },
        '*::-webkit-scrollbar': {
          display: 'none'
        }
      }
    }
  };
};
