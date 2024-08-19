import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
interface AccordionType {
  MuiAccordion: {
    defaultProps?: ComponentsProps['MuiAccordion'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiAccordion'];
    variants?: ComponentsVariants['MuiAccordion'];
  };
}

export const getAccordion = (theme: Theme): AccordionType => {
  const { palette } = theme;
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: theme.shadows[1],
          border: `0px solid ${palette.outlineVariant.main}`,
          color: palette.onBackground.main,
          backgroundColor: palette.surfaceBright.main,
          '&:before': {
            backgroundColor: palette.surfaceBright.main,
            display: 'none'
          },
          '&.Mui-disabled': {
            backgroundColor: palette.inverseOnSurface.main,
            color: palette.inverseSurface.main,
            border: `0px solid ${palette.outlineVariant.main}`
          },
          '& .MuiAccordionSummary-root > .MuiAccordionSummary-expandIconWrapper ': {
            color: palette.onBackground.main
          }
        }
      }
    }
  };
};
