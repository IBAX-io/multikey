import { useState, ChangeEvent, useCallback } from 'react';
import { TextField, Button, Box, Stack, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FormControl from '@mui/material/FormControl';
import { LoginType, HelperType } from '@/dataType';

const CreateAccount = ({
  change,
  changeLogin
}: {
  change: (_num: number) => void;
  changeLogin: (_data: LoginType) => void;
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [nameHelper, setNameHelper] = useState<HelperType | null>(null);
  const [type, setType] = useState('text');
  const [passwordHelper, setPasswordHelper] = useState<HelperType | null>(null);
  const [password, setPassword] = useState('');
  const [isCheck, setIsCheck] = useState(true);
  const handleVerifyName = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('login.empty'),
          boo: true
        };
        setNameHelper(helperData);
        return false;
      } else if (str.length > 16) {
        const helperData: HelperType = {
          text: t('login.maxName'),
          boo: true
        };
        setNameHelper(helperData);
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setNameHelper(helperData);
        return true;
      }
    },
    [t]
  );
  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const str = value.trim();
    setName(str);
    handleVerifyName(value);
  };
  const handleVerifyPassword = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('login.pwEmpty'),
          boo: true
        };
        setPasswordHelper(helperData);
        return false;
      } else if (str.length > 50) {
        const helperData: HelperType = {
          text: t('login.maxpw'),
          boo: true
        };
        setPasswordHelper(helperData);
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setPasswordHelper(helperData);
        return true;
      }
    },
    [t]
  );
  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setType('password');
    setPassword(value);
    handleVerifyPassword(value);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const checkName = handleVerifyName(name);
    const checkPassword = handleVerifyPassword(password);
    if (checkName && checkPassword && isCheck) {
      change(3);
      changeLogin({ name, password });
    }
  };
  const handleChangeCheck = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    setIsCheck(event.target.checked);
  };
  return (
    <Box>
      <FormControl sx={{ minWidth: 120, width: '100%', mb: 3 }}>
        <TextField
          label={t('login.name')}
          onChange={handleChangeName}
          autoComplete="off"
          variant="outlined"
          color="secondary"
          type="text"
          value={name}
          error={nameHelper ? nameHelper.boo : false}
          fullWidth
          helperText={nameHelper ? nameHelper.text : ''}
        />
      </FormControl>
      <FormControl sx={{ minWidth: 120, width: '100%', mb: 3 }}>
        <TextField
          label={t('login.password')}
          onChange={handleChangePassword}
          autoComplete="off"
          variant="outlined"
          color="secondary"
          type={type}
          value={password}
          error={passwordHelper ? passwordHelper.boo : false}
          fullWidth
          helperText={passwordHelper ? passwordHelper.text : ''}
        />
      </FormControl>
      <FormControl required error={!isCheck} component="fieldset" sx={{ mb: 3 }} variant="standard">
        <FormControlLabel
          control={<Checkbox onChange={handleChangeCheck} checked={isCheck} size="medium" />}
          label={t('login.know')}
          sx={{ '& .MuiTypography-root': { fontSize: 14 } }}></FormControlLabel>
        {!isCheck ? <FormHelperText>{t('login.checkKnow')}</FormHelperText> : ''}
      </FormControl>
      <Stack direction="row" justifyContent="end">
        <Button variant="filled" onClick={handleSubmit} sx={{ minWidth: 200, lineHeight: 2.4 }} size="large">
          {t('login.create')}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateAccount;
