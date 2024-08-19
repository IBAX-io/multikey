import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
import { alpha } from '@mui/material';
interface BackdropType {
  MuiBackdrop: {
    defaultProps?: ComponentsProps['MuiBackdrop'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiBackdrop'];
    variants?: ComponentsVariants['MuiBackdrop'];
  };
}

export const getBackdrop = (theme: Theme): BackdropType => {
  const { palette } = theme;
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          zIndex: theme.zIndex.drawer + 10000,
          '&.MuiBackdrop-root.MuiBackdrop-root-loading': {
            boxShadow: theme.shadows[1],
            border: `0px solid ${palette.outlineVariant.main}`,
            color: palette.onBackground.main,
            backgroundColor: alpha(palette.primary.main, 0.5)
          }
        }
      }
    }
  };
};
