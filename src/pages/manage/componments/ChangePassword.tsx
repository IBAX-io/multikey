import { AccountItem, AccountList, HelperType } from '@/dataType';
import util from '@/plugins/util';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import { ChangeEvent, forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChangePassword = (props: { success: () => void }, ref: Ref<unknown> | undefined) => {
  const { t } = useTranslation();
  const { success } = props;
  const [current, setCurrent] = useState<AccountItem | null>(null);
  const [accountList, setAccountList] = useState<AccountList | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordHelper, setOldPasswordHelper] = useState<HelperType | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordHelper, setNewPasswordHelper] = useState<HelperType | null>(null);
  const [againPassword, setAgainPassword] = useState('');
  const [againPasswordHelper, setAgainPasswordHelper] = useState<HelperType | null>(null);

  const handleVerifyOldPassword = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('manage.oldPassword'),
          boo: true
        };
        setOldPasswordHelper(helperData);
        return false;
      } else if (value !== current?.password) {
        const helperData: HelperType = {
          text: t('manage.oldError'),
          boo: true
        };
        setOldPasswordHelper(helperData);
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setOldPasswordHelper(helperData);
        return true;
      }
    },
    [current?.password, t]
  );
  const handleOldPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleVerifyOldPassword(value);
    setOldPassword(value);
  };
  const handleVerifyNewPassword = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('manage.inputPassword'),
          boo: true
        };
        setNewPasswordHelper(helperData);
        return false;
      } else if (str.length > 50) {
        const helperData: HelperType = {
          text: t('manage.longPassword'),
          boo: true
        };
        setNewPasswordHelper(helperData);
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setNewPasswordHelper(helperData);
        return true;
      }
    },
    [t]
  );
  const handleNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleVerifyNewPassword(value);
    setNewPassword(value);
  };
  const handleVerifyAgainPassword = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('manage.againPassword'),
          boo: true
        };
        setAgainPasswordHelper(helperData);
        return false;
      } else if (value !== newPassword) {
        const helperData: HelperType = {
          text: t('manage.againNot'),
          boo: true
        };
        setAgainPasswordHelper(helperData);
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setAgainPasswordHelper(helperData);
        return true;
      }
    },
    [newPassword, t]
  );
  const handleAgainPassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    handleVerifyAgainPassword(value);
    setAgainPassword(value);
  };
  const handleCancel = () => {
    setOldPassword('');
    setNewPassword('');
    setAgainPassword('');
    setAgainPasswordHelper(null);
    setNewPasswordHelper(null);
    setOldPasswordHelper(null);
  };
  useImperativeHandle(ref, () => ({
    handleCancel
  }));
  const handleConfirm = () => {
    const checkOldPassword = handleVerifyOldPassword(oldPassword);
    const checkNewPassword = handleVerifyNewPassword(newPassword);
    const checkAgainPassword = handleVerifyAgainPassword(againPassword);
    const accountData1 = util.getCache(`accountList`);
    console.log(accountList);
    console.log(current);
    if (checkOldPassword && checkNewPassword && checkAgainPassword) {
      setCurrent({
        ...current!,
        password: againPassword
      });
      const list = accountData1!.map((item: AccountItem) => {
        if (item.id === current!.selectId) {
          item.password = againPassword;
          return item;
        }
        return item;
      });
      console.log('🚀 ~ file: ChangePassword.tsx:151 ~ list ~ list:', list);
      util.setCache(`accountList`, list);
      util.setCache('current', {
        ...current!,
        password: againPassword
      });
      if (accountList) {
        const changeList = accountList!.map((item: AccountItem) => {
          if (item.privateKey) {
            item.password = againPassword;
            return item;
          }
          return item;
        });
        console.log('🚀 ~ file: ChangePassword.tsx:168 ~ changeList ~ changeList:', changeList);
        setAccountList(() => {
          return [...changeList!];
        });
        util.setCache(`${current!.mnemonic}-${current!.selectId}`, changeList);
      }
      success();
    }
  };
  useEffect(() => {
    const handleCurrentData = () => {
      const currentData = util.getCache('current');
      console.log('🚀 ~ file: ChangePassword.tsx:189 ~ handleCurrentData ~ currentData:', currentData);
      const accountData = util.getCache(`${currentData.mnemonic}-${currentData.selectId}`);
      console.log('🚀 ~ file: ChangePassword.tsx:43 ~ fetchData ~ currentData:', currentData);
      const accountData1 = util.getCache(`accountList`);
      console.log('🚀 ~ file: ChangePassword.tsx:194 ~ handleCurrentData ~ accountData1:', accountData1);
      try {
        setCurrent(currentData);
        setAccountList(accountData);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    };
    handleCurrentData();
  }, []);
  return (
    <Box mb={3}>
      <Typography variant="h6" mb={1}>
        {t('manage.safety')}
      </Typography>
      <Typography variant="body2" mb={2}>
        {t('manage.setting')}
      </Typography>
      <Box sx={{ width: { md: '60%', sm: '100%' } }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel
            htmlFor="outlined-adornment-oldPassword"
            required
            sx={{ fontSize: 16 }}
            error={oldPasswordHelper ? oldPasswordHelper.boo : false}>
            {t('manage.check')}
          </InputLabel>
          <OutlinedInput
            fullWidth
            placeholder={t('manage.old')}
            size="medium"
            autoComplete="off"
            type="password"
            value={oldPassword}
            id="outlined-adornment-oldPassword"
            onChange={handleOldPassword}
            startAdornment={<InputAdornment position="start"></InputAdornment>}
            label={t('manage.check')}
            error={oldPasswordHelper ? oldPasswordHelper.boo : false}
          />
          <FormHelperText error={true}>{oldPasswordHelper ? oldPasswordHelper.text : ''}</FormHelperText>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel
            htmlFor="outlined-adornment-newPassword"
            required
            sx={{ fontSize: 16 }}
            error={newPasswordHelper ? newPasswordHelper.boo : false}>
            {t('manage.newPassword')}
          </InputLabel>
          <OutlinedInput
            fullWidth
            placeholder={t('manage.new')}
            size="medium"
            autoComplete="off"
            type="password"
            value={newPassword}
            id="outlined-adornment-newPassword"
            onChange={handleNewPassword}
            startAdornment={<InputAdornment position="start"></InputAdornment>}
            label={t('manage.newPassword')}
            error={newPasswordHelper ? newPasswordHelper.boo : false}
          />
          <FormHelperText error={true}>{newPasswordHelper ? newPasswordHelper.text : ''}</FormHelperText>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel
            htmlFor="outlined-adornment-againPassword"
            required
            sx={{ fontSize: 16 }}
            error={againPasswordHelper ? againPasswordHelper.boo : false}>
            {t('manage.again')}
          </InputLabel>
          <OutlinedInput
            fullWidth
            placeholder={t('manage.new')}
            size="medium"
            autoComplete="off"
            type="password"
            value={againPassword}
            id="outlined-adornment-againPassword"
            onChange={handleAgainPassword}
            startAdornment={<InputAdornment position="start"></InputAdornment>}
            label={t('manage.again')}
            error={againPasswordHelper ? againPasswordHelper.boo : false}
          />
          <FormHelperText error={true}>{againPasswordHelper ? againPasswordHelper.text : ''}</FormHelperText>
        </FormControl>
        <Stack direction="row" justifyContent="space-around">
          <Button variant="outlined" onClick={handleCancel} sx={{  minWidth: 150 }} size="large">
            {t('login.cancel')}
          </Button>
          <Button variant="filled" onClick={handleConfirm} sx={{   minWidth: 150}} size="large">
            {t('login.confirm')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default forwardRef(ChangePassword);
