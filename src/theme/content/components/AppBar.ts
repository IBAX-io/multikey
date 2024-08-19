import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';

interface AppBarType {
  MuiAppBar: {
    defaultProps?: ComponentsProps['MuiAppBar'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiAppBar'];
    variants?: ComponentsVariants['MuiAppBar'];
  };
}

export const getAppBar = (theme: Theme): AppBarType => {
  const { palette } = theme;
  return {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'default'
      },
      styleOverrides: {
        colorDefault: {
          backgroundColor: palette.onBody.main,
          color: palette.onSurface.main
        },
        colorPrimary: {
          background: palette.surface.main,
          color: palette.onSurface.main
        }
      }
    }
  };
};
