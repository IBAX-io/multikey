import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
interface TypographyType {
  MuiTypography: {
    defaultProps?: ComponentsProps['MuiTypography'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTypography'];
    variants?: ComponentsVariants['MuiTypography'];
  };
}

export const getTypography = (theme: Theme): TypographyType => {
  const { palette } = theme;
  return {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: palette.container.contrastText,
          fontWeight: 400,
          fontFamily: ['Inter', 'sans-serif'].join(',')
        },
        h5: {
          color: palette.onTitle.main,
          fontWeight: 'bolder'
        },
        h6: {
          color: palette.onTitle.main,
          fontWeight: 'bolder'
        }
      }
    }
  };
};
