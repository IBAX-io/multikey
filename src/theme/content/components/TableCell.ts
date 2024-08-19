import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';

interface TableCellType {
  MuiTableCell: {
    defaultProps?: ComponentsProps['MuiTableCell'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTableCell'];
    variants?: ComponentsVariants['MuiTableCell'];
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getTableCell = (theme: Theme): TableCellType => {
  const { palette } = theme;
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          [`&.${tableCellClasses.head}`]: {
            background: palette.onBody.main,
            color: palette.onSurfaceVariant.main,
            border: 0,
            fontWeight: 'bolder',
            '&:first-of-type': {
              borderTopLeftRadius: 10
            },
            '&:last-of-type': {
              borderTopRightRadius: 10
            }
          },
          [`&.${tableCellClasses.body}`]: {
            fontSize: 14
            /*  '&:first-of-type': {
              borderBottomLeftRadius: 10
            },
            '&:last-of-type': {
              borderBottomRightRadius: 10
            } */
          }
        }
      }
    }
  };
};
