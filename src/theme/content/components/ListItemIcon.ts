import type { Theme, ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material';

interface ListItemIconType {
  MuiListItemIcon: {
    defaultProps?: ComponentsProps['MuiListItemIcon'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiListItemIcon'];
    variants?: ComponentsVariants['MuiListItemIcon'];
  };
}

export const getListItemIcon = (): ListItemIconType => {
  //const { palette } = theme;
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 32,
          '&.Mui-selected': {
            fontWeight: 'bold'
          }
        }
      }
    }
  };
};
