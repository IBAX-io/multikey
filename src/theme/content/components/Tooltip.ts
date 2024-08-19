import type { Theme, ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material';

interface TooltipType {
  MuiTooltip: {
    defaultProps?: ComponentsProps['MuiTooltip'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTooltip'];
    variants?: ComponentsVariants['MuiTooltip'];
  };
}

export const getTooltip = (theme: Theme): TooltipType => {
  const { palette } = theme;
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: palette.inverseSurface.main,
          color: palette.inverseOnSurface.main
        }
      }
    }
  };
};
