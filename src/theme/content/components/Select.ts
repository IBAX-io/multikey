import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
interface SelectType {
  MuiSelect: {
    defaultProps?: ComponentsProps['MuiSelect'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiSelect'];
    variants?: ComponentsVariants['MuiSelect'];
  };
}

export const getSelect = (theme: Theme): SelectType => {
  const { palette } = theme;
  return {
    MuiSelect: {
      styleOverrides: {
        select: {
          // palette.surfaceBright.main
          backgroundColor: palette.container.main,
          color: palette.container.contrastText
        }
      }
    }
  };
};
