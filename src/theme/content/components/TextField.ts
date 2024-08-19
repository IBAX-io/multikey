import type { ComponentsOverrides, ComponentsProps, ComponentsVariants, Theme } from '@mui/material';
interface TextFieldType {
  MuiTextField: {
    defaultProps?: ComponentsProps['MuiTextField'];
    styleOverrides?: ComponentsOverrides<Theme>['MuiTextField'];
    variants?: ComponentsVariants['MuiTextField'];
  };
}

export const getTextField = (theme: Theme): TextFieldType => {
  const { palette } = theme;
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          color: palette.onBackground.main,
          '& label.Mui-focused': {
            color: palette.primary.main
          },
          // palette.surfaceBright.main
          '& .MuiInputBase-root': {
            backgroundColor: palette.container.main,
            color: palette.container.contrastText,
            borderColor: palette.onBorder.main,
            '&.Mui-focused fieldset': {
              borderColor: palette.onBorder.main,
              borderWidth: '2px'
            }
            /*  '&:hover': {
              backgroundColor: getStateLayerColor(
                StateLayer.Hover,
                palette.surfaceContainerLow.main,
                palette.onSurface.main
              ),
              color: getStateLayerColor(StateLayer.Hover, palette.onSurfaceVariant.main, palette.onSurface.main)
            },
            '&:focus': {
              backgroundColor: getStateLayerColor(
                StateLayer.Focus,
                palette.surfaceContainerLow.main,
                palette.onSurface.main
              ),
              color: 'red'
            },
            '&:active': {
              backgroundColor: getStateLayerColor(
                StateLayer.Press,
                palette.surfaceContainerLow.main,
                palette.onSecondaryContainer.main
              ),
              color: 'red'
            },
            */
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
