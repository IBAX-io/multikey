import { Autocomplete, TextField, ListItem, Typography, ListItemText, Avatar, InputAdornment } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { valueData, localeData, langValue } from '@/store/lang';
import { arrLang } from '@/lang/config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useTranslation } from 'react-i18next';
const win = window;
const ChangeLanguage = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const value = useAppSelector(langValue);
  const handleChangeLang = async (item: { label: string; value: string }) => {
    i18n.changeLanguage(item.value);
    await dispatch(valueData(item.value));
    await dispatch(localeData(item.value));
    localStorage.setItem('lang', item.value);
    win.location.reload();
  };
  return (
    <>
      <Autocomplete
        freeSolo
        id="language-change"
        sx={{ width: 300 }}
        size="medium"
        value={arrLang.find((item: { label: string; value: string }) => {
          return item.value === value;
        })}
        options={arrLang}
        getOptionLabel={(option: any) => {
          return option.label;
        }}
        onChange={(_event: any, newValue: any) => {
          handleChangeLang(newValue);
        }}
        disableClearable
        clearIcon=""
        renderInput={(params) => {
          return (
            <TextField
              variant="outlined"
              className="team-search"
              {...params}
              /* label="Search input" */
              InputProps={{
                ...params.InputProps,
                type: 'search',
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar
                      alt="Remy Sharp"
                      src={
                        arrLang.find((item: { label: string; value: string }) => {
                          return item.value === value;
                        })?.logo
                      }
                      sx={{ width: 25, height: 25 }}
                    />
                  </InputAdornment>
                )
              }}
            />
          );
        }}
        renderOption={(props, item: { label: string; value: string; logo: string }) => {
          return (
            <ListItem {...props}>
              {value === item.value ? (
                <CheckIcon color="success" />
              ) : (
                <Typography fontSize={20} width={20}></Typography>
              )}
              <Avatar alt="Remy Sharp" src={item.logo} sx={{ width: 25, height: 25 }} />
              <ListItemText primary={item.label} sx={{ ml: 1 }} />
            </ListItem>
          );
        }}
      />
    </>
  );
};
export default ChangeLanguage;
