import type { Theme, ComponentsProps, ComponentsOverrides, ComponentsVariants } from '@mui/material';
import { StateLayer, getStateLayerColor } from '../utils/getStayeLayerColor';
interface InputLabelType {
  MuiInputLabel: {
    defaultProps?: ComponentsProps['MuiInputLabel'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiInputLabel'];
    variants?: ComponentsVariants['MuiInputLabel'];
  };
}

export const getInputLabel = (theme: Theme): InputLabelType => {
  const { palette } = theme;
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // color: palette.onBackground.main,
          fontSize: 14,
          // palette.surfaceBright.main
          '& .MuiInputLabel-root': {
            backgroundColor: getStateLayerColor(
              StateLayer.Hover,
              palette.surfaceBright.main,
              palette.surfaceBright.main
            ),
            color: getStateLayerColor(StateLayer.Hover, palette.onSurfaceVariant.main, palette.onSurface.main),
            fontSize: 14

            /*  '&:hover': {
              backgroundColor: getStateLayerColor(
                StateLayer.Hover,
                palette.surfaceContainerLow.main,
                palette.onSurface.main
              ),
              color: getStateLayerColor(StateLayer.Hover, palette.onSurfaceVariant.main, palette.onSurface.main)
            } */
            /*  '&:focus': {
              backgroundColor: getStateLayerColor(
                StateLayer.Focus,
                palette.surfaceContainerLow.main,
                palette.onSurface.main
              ),
              color: getStateLayerColor(StateLayer.Focus, palette.onSurfaceVariant.main, palette.onSurface.main)
            },
            '&:active': {
              backgroundColor: getStateLayerColor(
                StateLayer.Press,
                palette.surfaceContainerLow.main,
                palette.onSecondaryContainer.main
              ),
              color: getStateLayerColor(StateLayer.Press, palette.onSurfaceVariant.main, palette.onSurface.main)
            } */
          }
        }
      }
    }
  };
};
