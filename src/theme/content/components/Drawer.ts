import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';

interface DrawerType {
  MuiDrawer: {
    defaultProps?: ComponentsProps['MuiDrawer'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiDrawer'];
    variants?: ComponentsVariants['MuiDrawer'];
  };
}

export const getDrawer = (theme: Theme): DrawerType => {
  const { palette } = theme;
  return {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: '0px',
          backgroundColor: palette.onBody.main,
          color: palette.container.contrastText
        }
      }
    }
  };
};
