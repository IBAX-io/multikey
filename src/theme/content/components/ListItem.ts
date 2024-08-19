import type { Theme, ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material';

interface ListItemType {
  MuiListItem: {
    defaultProps?: ComponentsProps['MuiListItem'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiListItem'];
    variants?: ComponentsVariants['MuiListItem'];
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getListItem = (_theme: Theme): ListItemType => {
  return {
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 1,
          paddingBottom: 1,
          // background: palette.surfaceContainer.main,
          //  color: palette.onSurfaceVariant.main,
          //  borderRadius: 50,
          '& .MuiListItemButton-root': {
            paddingTop: 8,
            paddingBottom: 8
          }
        }
      }
    }
  };
};
