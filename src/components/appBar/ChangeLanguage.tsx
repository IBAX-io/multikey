import { arrLang } from '@/lang/config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { langValue, localeData, valueData } from '@/store/lang';
import { Avatar, Box, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
const win = window;
const ChangeLanguage = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const locale = useAppSelector(langValue);
  const handleLangChange = async (event: SelectChangeEvent) => {
    const value = event.target.value;
    await dispatch(valueData(value));
    await dispatch(localeData(value));
    localStorage.setItem('lang', value);
    i18n.changeLanguage(value);
    win.location.reload();
  };
  return (
    <Box>
      <Select
        sx={{
          '& fieldset': {
            border: 'none'
          },
          '& .MuiInputBase-input.MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.onBody.main
          }
        }}
        labelId="lang-simple-select-label"
        id="lang-simple-select"
        value={locale}
        onChange={handleLangChange}>
        {arrLang.map((item: { label: string; value: string; logo: string }) => {
          return (
            <MenuItem key={item.value} value={item.value}>
              <Avatar alt="Remy Sharp" src={item.logo} sx={{ width: 25, height: 25 }} />
              <Typography mx={1}>{item.label}</Typography>
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
};

export default ChangeLanguage;
