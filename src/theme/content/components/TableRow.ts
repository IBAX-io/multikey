import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';

interface TableRowType {
  MuiTableRow: {
    defaultProps?: ComponentsProps['MuiTableRow'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTableRow'];
    variants?: ComponentsVariants['MuiTableRow'];
  };
}

export const getTableRow = (theme: Theme): TableRowType => {
  const { palette } = theme;
  return {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: palette.onBody.main
          },
          '&:not(last-child) td': {
            borderColor: palette.surfaceVariant.main
          },
          // hide last border
          '&:last-child td, &:last-child th': {
            borderColor: palette.surfaceVariant.main
          }
        }
      }
    }
  };
};
