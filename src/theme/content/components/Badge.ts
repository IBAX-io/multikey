import type { Theme, ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material';

declare module '@mui/material/Badge' {
  interface BadgePropsColorOverrides {
    tertiary: true;
  }
}

interface BadgeType {
  MuiBadge: {
    defaultProps?: ComponentsProps['MuiBadge'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiBadge'];
    variants?: ComponentsVariants['MuiBadge'];
  };
}

export const getBadge = (theme: Theme): BadgeType => {
  const { palette } = theme;
  return {
    MuiBadge: {
      defaultProps: { color: 'default' },
      variants: [
        {
          props: { color: 'default' },
          style: {
            '.MuiBadge-badge': {
              backgroundColor: palette.error.main,
              color: palette.onError.main
            }
          }
        }
      ]
    }
  };
};
