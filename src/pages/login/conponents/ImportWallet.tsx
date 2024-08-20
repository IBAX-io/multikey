import { TabPanelProps } from '@/dataType';
import ethers from '@/plugins/ethers';
import keyring from '@/plugins/keyring';
import util from '@/plugins/util';
import { Box, Button, InputAdornment, styled, Tab, Tabs, TextareaAutosize, TextField, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { ChangeEvent, SyntheticEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginContext } from './LoginContext';
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`wallet-${index}`}
      aria-labelledby={`info-${index}`}
      {...other}
      minHeight="25vh">
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </Box>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
const handleNumber = () => {
  const arr = [];
  for (let index = 0; index < 12; index++) {
    arr.push(index + 1);
  }
  return arr;
};
const BootsTextareaAutosize = styled(TextareaAutosize)(({ theme }) => {
  return {
    '&': {
      backgroundColor: theme.palette.container.main,
      color: theme.palette.container.contrastText
    }
  };
});
const ImportWallet = () => {
  //const { palette } = useTheme();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [word, setWord] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [verifyPrivate, setVerifyPrivate] = useState(t('login.privateEmpty'));
  const { change, loginData } = useContext(LoginContext);
  const handleTabsChange = (_event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setTextareaValue('');
    setWords([]);
  };
  const arrNum = handleNumber();
  const handleChangeWords = (value: string, i: number) => {
    setWord(value);
    setWords(() => {
      words[i] = value;
      return words;
    });
  };
  const handleBlurWords = (index: number) => {
    if (word) {
      const res = word.replace(/^\s+|\s+$/g, '');
      const arrRes = res.split(' ');
      if (arrRes.length === 12) {
        setWords(() => {
          words[index] = '';
          return [...words];
        });
        const arrWords: string[] = [];
        for (let i = 0; i < arrRes.length; i += 1) {
          arrWords[i] = arrRes[i];
        }
        setWords(() => {
          return [...arrWords];
        });
      }
    }
  };
  const handleChangeTextarea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setTextareaValue(value);
  };
  const handleCancel = () => {
    change(3);
  };
  const handleImport = () => {
    const accountList = util.getCache('accountList');
    util.removeCache('current');
    if (tabValue === 1) {
      if (textareaValue === '') {
        setVerifyPrivate(t('login.privateEmpty'));
        setIsOpen(true);
      } else if (!ethers.publicKey(textareaValue)) {
        setVerifyPrivate(t('login.privateError'));
        setIsOpen(true);
      } else {
        const publicKey = ethers.publicKey(textareaValue) as string;
        console.log('🚀 ~ file: ImportWallet.tsx:101 ~ handleImport ~ publicKey:', publicKey);
        const getKeyring = keyring.getKeyring();
        const keyId = getKeyring.publicToID(publicKey);
        const account = keyring.addressString(keyId);
        const obj = {
          id: util.uuid(),
          name: loginData.name,
          mnemonic: '',
          password: loginData.password,
          privateKey: textareaValue,
          publicKey,
          account,
          isShow: true,
          isLogin: true
        };
        if (accountList) {
          accountList.push(obj);
          util.setCache('accountList', accountList);
        } else {
          util.setCache('accountList', [obj]);
        }
        change(1);
      }
    } else {
      const strWords = words.join(' ');
      if (words.length === 0) {
        setVerifyPrivate(t('login.mnemonicEmpty'));
        setIsOpen(true);
      } else if (!ethers.verifyMnemonic(strWords)) {
        setVerifyPrivate(t('login.mnemonicError'));
        setIsOpen(true);
      } else {
        const { privateKey } = ethers.wallet(strWords);
        const publicKey = ethers.publicKey(privateKey) as string;
        console.log('🚀 ~ file: ImportWallet.tsx:135 ~ handleImport ~ publicKey:', publicKey);
        const getKeyring = keyring.getKeyring();
        const keyId = getKeyring.publicToID(publicKey);
        const account = keyring.addressString(keyId);
        const obj = {
          id: util.uuid(),
          index: 0,
          name: loginData.name,
          mnemonic: strWords,
          password: loginData.password,
          privateKey,
          publicKey,
          account,
          isShow: true,
          isLogin: true
        };
        if (accountList) {
          accountList.push(obj);
          util.setCache('accountList', accountList);
        } else {
          util.setCache('accountList', [obj]);
        }
        change(1);
      }
    }
  };
  const handleSnackbarClose = () => {
    setIsOpen(false);
  };
  return (
    <Box width="100%">
      <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 12, lg: 16 }, mb: { xs: 1, md: 2, lg: 3 } }}>
        {t('login.use')}
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabsChange}
        textColor="primary"
        centered
        indicatorColor="primary"
        aria-label="full width tabs example">
        <Tab label={t('login.word')} {...a11yProps(0)} />
        <Tab label={t('login.private')} {...a11yProps(1)} />
      </Tabs>
      <Box width="100%" sx={{ overflowY: 'auto' }}>
        <CustomTabPanel value={tabValue} index={0}>
          <Box mb={2}>
            <Typography mb={1} sx={{ fontSize: { xs: 12, md: 14, lg: 16 } }}>
              {t('login.restore')}
            </Typography>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={2} height={180}>
              {arrNum.map((item: number, index: number) => {
                return (
                  <TextField
                    autoComplete="off"
                    key={item}
                    sx={{
                      width: '20%',
                      mx: 1,
                      mb: { xs: 1, md: 1, lg: 2 },
                      fontSize: { xs: 12, md: 12, lg: 16 },
                      '& .MuiInputBase-input': {
                        p: { xs: 0.5, md: 0.5, lg: 1 }
                      }
                    }}
                    value={words[index] || ''}
                    size="medium"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">{item}</InputAdornment>
                    }}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const { value } = event.target;
                      handleChangeWords(value, index);
                    }}
                    onBlur={() => {
                      handleBlurWords(index);
                    }}></TextField>
                );
              })}
            </Box>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <Box mb={2}>
            <Typography mb={1} sx={{ fontSize: { xs: 12, md: 14, lg: 16 } }}>
              {t('login.text')}
            </Typography>
            <Box
              width="100%"
              height={180}
              mb={2}
              sx={{
                backgroundColor: (theme) => theme.palette.container.main,
                color: (theme) => theme.palette.container.contrastText
              }}>
              <BootsTextareaAutosize
                minRows={6}
                maxRows={6}
                className="w-full p-3 border"
                value={textareaValue}
                onChange={handleChangeTextarea}></BootsTextareaAutosize>
            </Box>
          </Box>
        </CustomTabPanel>
      </Box>
      <Box display="flex" justifyContent="space-around">
        <Button variant="filled" sx={{  minWidth: 150 }} onClick={handleCancel} size="large">
          {t('login.cancel')}
        </Button>
        <Button variant="filled" sx={{ minWidth: 150 }} onClick={handleImport} size="large">
          {t('login.start')}
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
        sx={{
          '& .MuiAlert-action': {
            mr: 3
          }
        }}>
        <Alert onClose={handleSnackbarClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          {verifyPrivate}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportWallet;
