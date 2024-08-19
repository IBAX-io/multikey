import type { Theme, ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material';

interface MenuType {
  MuiMenu: {
    defaultProps?: ComponentsProps['MuiMenu'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiMenu'];
    variants?: ComponentsVariants['MuiMenu'];
  };
}

export const getMenu = (theme: Theme): MenuType => {
  const { palette } = theme;
  return {
    MuiMenu: {
      defaultProps: { color: 'default' },
      styleOverrides: {
        root: {},
        paper: {
          backgroundColor: palette.surfaceContainerLow.main,
          boxShadow: theme.shadows[3],
          color: palette.onSurface.main
        }
      }
    }
  };
};
