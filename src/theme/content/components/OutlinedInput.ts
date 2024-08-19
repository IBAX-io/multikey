import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
import { StateLayer, getStateLayerColor } from '../utils/getStayeLayerColor';
interface OutlinedInputType {
  MuiOutlinedInput: {
    defaultProps?: ComponentsProps['MuiOutlinedInput'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiOutlinedInput'];
    variants?: ComponentsVariants['MuiOutlinedInput'];
  };
}

export const getOutlinedInput = (theme: Theme): OutlinedInputType => {
  const { palette } = theme;
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: palette.container.main,
          color: palette.container.contrastText,
          borderColor: palette.onBorder.main,
          '& label.Mui-focused': {
            color: palette.primary.main
          },
          '& input::placeholder': {
            fontSize: 12
          },
          '& textarea::placeholder': {
            fontSize: 12
          },
          '& input[type="number"]': {
            appearance: 'textfield'
          },
          '& input::-webkit-outer-spin-button': {
            appearance: 'none'
          },
          '& input::-webkit-inner-spin-button': {
            appearance: 'none'
          },
          '& fieldset': {
            borderColor: palette.onBorder.main
          },
          '&.Mui-disabled fieldset.MuiOutlinedInput-notchedOutline': {
            borderColor: palette.onBorder.main,
            color: palette.container.contrastText
          },
          '& .MuiInputBase-input.MuiOutlinedInput-input': {
            color: palette.container.contrastText,
            textFillColor: palette.container.contrastText
          },
          // palette.surfaceBright.main
          '& .MuiInputBase-root': {
            backgroundColor: getStateLayerColor(
              StateLayer.Hover,
              palette.surfaceBright.main,
              palette.surfaceBright.main
            ),
            color: getStateLayerColor(StateLayer.Hover, palette.onSurfaceVariant.main, palette.onSurface.main),
            '&.Mui-focused fieldset': {
              borderColor: palette.onBorder.main
            },
            '& fieldset': {
              borderColor: palette.onBorder.main
            }
          },
          '& label': {
            fontSize: 14,
            lineHeight: 1.5
          }
        }
      }
    }
  };
};
