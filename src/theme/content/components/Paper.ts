import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
interface PaperType {
  MuiPaper: {
    defaultProps?: ComponentsProps['MuiPaper'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiPaper'];
    variants?: ComponentsVariants['MuiPaper'];
  };
}

export const getPaper = (theme: Theme): PaperType => {
  const { palette } = theme;
  return {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: palette.container.main,
          fontWeight: 400,
          fontFamily: ['Inter', 'sans-serif'].join(','),
          '&.MuiPopover-paper': {
            backgroundColor: palette.container.main
          }
        }
      }
    }
  };
};
