import type { Theme } from '@mui/material';
import {
  getAccordion,
  getAlert,
  getAppBar,
  getBackdrop,
  getBadge,
  getButton,
  getCard,
  getCssBaseline,
  getDrawer,
  getFab,
  getInputLabel,
  getListItem,
  getListItemButton,
  getListItemIcon,
  getMenu,
  getOutlinedInput,
  getPaper,
  getSelect,
  getSwitch,
  getTableCell,
  getTableRow,
  getTextField,
  getToggleButton,
  getToggleButtonGroup,
  getTooltip,
  getTypography
} from '../components';

type ComponentsType = { components: Theme['components'] };

export const getMUIComponents = (theme: Theme) => {
  // const { palette } = theme;
  return {
    components: {
      ...getCssBaseline(theme),
      ...getAccordion(theme),
      ...getAlert(theme),
      ...getAppBar(theme),
      ...getBadge(theme),
      ...getButton(theme),
      ...getCard(theme),
      ...getDrawer(theme),
      ...getFab(theme),
      ...getListItem(theme),
      ...getListItemButton(theme),
      ...getListItemIcon(),
      ...getTypography(theme),
      ...getPaper(theme),
      ...getMenu(theme),
      ...getSwitch(theme),
      ...getToggleButton(theme),
      ...getToggleButtonGroup(theme),
      ...getTooltip(theme),
      ...getTextField(theme),
      ...getSelect(theme),
      ...getInputLabel(theme),
      ...getOutlinedInput(theme),
      ...getBackdrop(theme),
      ...getTableCell(theme),
      ...getTableRow(theme)
    }
  } as ComponentsType;
};
