import { AccountItem, HelperType, LoginData, UidData } from '@/dataType';
import keyring from '@/plugins/keyring';
import { handleGetuid, handlePostLogin } from '@/plugins/request/api';
import util from '@/plugins/util';
import {
  AppBar,
  Avatar,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  useTheme
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import ExtendTip from './ExtendTip';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
const LoginAccount = ({ change }: { change: (_num: number) => void }) => {
  // util.removeCache('accountList');
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameHelper, setNameHelper] = useState<HelperType | null>(null);
  const [type, setType] = useState('text');
  const [passwordHelper, setPasswordHelper] = useState<HelperType | null>(null);
  const [selectAccount, setSelectAccount] = useState<AccountItem>();
  const [isCheck, setIsCheck] = useState(true);
  const [accountList, setAccountList] = useState<AccountItem[]>(util.getCache('accountList') || []);
  const [result, setResult] = useState('');
  const [isTip, setIsTip] = useState(false);
  const handleVerifyName = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('login.select'),
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
  const handleNameChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    console.log('🚀 ~ file: LoginAccount.tsx:40 ~ handleNameChange ~ value:', value);
    setValue(value);
    const account = accountList.find((item: AccountItem) => {
      return item.id === value;
    });
    console.log('🚀 ~ file: LoginAccount.tsx:121 ~ account ~ account:', account);
    setSelectAccount(account!);
    setName(account!.name);
    handleVerifyName(account!.name);
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
      } else if (str !== selectAccount!.password) {
        const helperData: HelperType = {
          text: t('login.incorrect'),
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
    [selectAccount, t]
  );
  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setType('password');
    setPassword(event.target.value);
    handleVerifyPassword(value);
  };
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const checkName = handleVerifyName(name);
      const checkPassword = handleVerifyPassword(password);
      if (checkName && checkPassword && isCheck) {
        console.log(name, password);
        setLoading(true);
        const res = (await handleGetuid()) as UidData;
        const networkId = res.network_id;
        const { uid, hasher, token } = res;
        const getKeyring = keyring.getKeyring(hasher);
        const { privateKey } = selectAccount!;
        const publicKey = getKeyring.generatePublicKey(privateKey);
        console.log(publicKey === selectAccount!.publicKey);
        const nodeSign = getKeyring.sign(`LOGIN${parseInt(networkId, 10)}${uid}`, privateKey);
        console.log(nodeSign);
        const params = {
          data: {
            signature: nodeSign,
            pubkey: publicKey,
            ecosystem: 1
          },
          token
        };
        const loginData = (await handlePostLogin(params)) as LoginData;
        console.log('🚀 ~ file: LoginAccount.tsx:85 ~ handleSubmit ~ loginData:', loginData);
        const { account } = loginData!;
        const loginAccount: AccountItem = {
          ...selectAccount!,
          selectId: selectAccount!.id,
          publicKey,
          networkId: Number(networkId),
          account: account,
          keyId: loginData.key_id,
          isLogin: true
        };
        util.setCache('current', loginAccount);
        util.setCache('hasher', hasher);
        util.setCacheToken('token', loginData.token);
        if (selectAccount?.mnemonic) {
          const selectMnemonic = util.getCache(`${selectAccount?.mnemonic}-${selectAccount.id}`);
          if (!selectMnemonic) {
            util.setCache(`${selectAccount?.mnemonic}-${selectAccount.id}`, [loginAccount]);
          } else {
            const arr = selectMnemonic!.map((item: AccountItem) => {
              if (item.index === 0) {
                item.isLogin = true;
              } else {
                item.isLogin = false;
              }
              return item;
            });
            util.setCache(`${selectAccount?.mnemonic}-${selectAccount.id}`, arr);
          }
        }
        navigate('/', { replace: true });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const handleCreateAccount = () => {
    change(2);
  };
  const handleChangeCheck = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    setIsCheck(event.target.checked);
  };
  useEffect(() => {
    const handleStorageAccountList = () => {
      const accountList = util.getCache('accountList') || [];
      console.log('🚀 ~ file: LoginAccount.tsx:120 ~ handleStorageAccountList ~ accountList:', accountList);
      if (accountList.length) {
        setValue(String(accountList[0].id));
        setSelectAccount(accountList[0]);
        setName(accountList[0]!.name);
        setAccountList(accountList);
      }
    };
    handleStorageAccountList();
  }, []);
  const handleTabsChange = (_event: React.SyntheticEvent, newValue: number) => {
    console.log('🚀 ~ file: Assets.tsx:44 ~ handleChange ~ newValue:', newValue);
    setTabValue(newValue);
  };
  const handleChangeIndex = (index: number) => {
    console.log('🚀 ~ file: Assets.tsx:47 ~ handleChangeIndex ~ index:', index);
    setTabValue(index);
  };
  const handleLinkWallet = () => {
    const currNetwork = util.currNetwork();
    const installNode = document.getElementById('jutkey-chrome-extension-installed');
    console.log('🚀 ~ file: LinkWallet.tsx:60 ~ handleLinkWal ~ installNode:', installNode);
    try {
      console.log(document.location);
      const { rpc, walletId } = currNetwork;
      const { host, origin } = document.location;
      const editorExtensionId = walletId;
      chrome.runtime.sendMessage(
        editorExtensionId,
        { path: 'notice', params: { host, origin, rpc } },
        (response: any) => {
          console.log('Received message from wallet', response);
          setResult(response.result);
        }
      );
    } catch (error) {
      console.log('🚀 ~ file: LoginAccount.tsx:265 ~ handleLinkWal ~ error:', error);
      setIsTip(true);
    }
  };
  useEffect(() => {
    if (result) {
      document.addEventListener('jutkeyEvent', async ({ detail }: any) => {
        console.log('🚀 ~ file: HelloWorld.vue:64 ~ window.addEventListener ~ detail:', detail);
        if (detail.type === 'jutkey_connect') {
          const { current } = detail;
          current.isShow = true;
          current.isLogin = true;
          util.setCache('current', current);
          util.setCacheToken('token', current.token);
          util.setCacheToken('type', detail.type);
          location.href = '/';
        }
        if (detail.type === 'jutkey_break') {
          util.removeCache('current');
          util.removeCacheToken('token');
          util.removeCacheToken('type');
          location.href = '/login';
        }
      });
    }
  }, [result]);
  const handleDialogClose = () => {
    setIsTip(false);
  };
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <AppBar position="static">
          <Tabs
            centered
            value={tabValue}
            onChange={handleTabsChange}
            indicatorColor="secondary"
            textColor="inherit"
            aria-label="full width tabs assets"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'capitalize',
                '& .MuiPaper-root': {
                  width: '100%'
                }
              }
            }}>
            <Tab label={t('nav.local')} {...a11yProps(0)} />
            <Tab label={t('nav.jutkey')} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
      </Stack>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tabValue}
        onChangeIndex={handleChangeIndex}>
        <TabPanel value={tabValue} index={0} dir={theme.direction}>
          <FormControl sx={{ minWidth: 120, width: '100%', mb: 3 }} error={nameHelper ? nameHelper.boo : false}>
            <InputLabel id="name-select-helper-label">{t('login.name')}</InputLabel>
            <Select
              labelId="name-select-helper-label"
              id="name-simple-select-helper"
              value={value}
              label={`${t('login.name')}`}
              onChange={handleNameChange}
              MenuProps={{
                style: {
                  maxHeight: 350
                }
              }}
              renderValue={(selected) => {
                const account = accountList.find((item: AccountItem) => {
                  return item.id === selected;
                });
                if (account) {
                  return account!.name;
                }
              }}>
              {accountList.length ? (
                accountList.map((item: AccountItem) => {
                  return item.isShow ? (
                    <MenuItem value={item.id} key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <ListItemText primary={item.name}></ListItemText>
                    </MenuItem>
                  ) : (
                    ''
                  );
                })
              ) : (
                <MenuItem value={0} disabled>
                  <em className="text-sm">{t('login.no')}</em>
                </MenuItem>
              )}
            </Select>
            {nameHelper ? <FormHelperText>{nameHelper.text}</FormHelperText> : ''}
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
          <Stack direction="row" justifyContent="space-around">
            <Button
              variant="outlined"
              onClick={handleCreateAccount}
              sx={{ minWidth: 150, lineHeight: 2.4 }}
              size="large">
              {t('login.account')}
            </Button>
            <Button
              color="primary"
              variant="filled"
              size="large"
              onClick={handleSubmit}
              sx={{ ml: 3, minWidth: 150, lineHeight: 2.4 }}>
              {t('login.sign')}
            </Button>
          </Stack>
          <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </TabPanel>
        <TabPanel value={tabValue} index={1} dir={theme.direction}>
          <Box>
            {/*   <Typography variant="h6" textAlign="center">
              {t('nav.link')}
            </Typography> */}
            <Box height={277} display="flex" alignItems="center" justifyContent="center">
              <Button
                sx={{ width: '50%', justifyContent: 'space-around', height: '50px' }}
                size="large"
                variant="filled"
                endIcon={<Avatar alt="Remy Sharp" src="/logo-128.png" sx={{ width: 30, height: 30 }} />}
                onClick={handleLinkWallet}>
                Jutkey Wallet
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </SwipeableViews>
      <ExtendTip isTip={isTip} closeDialog={handleDialogClose}></ExtendTip>
    </Box>
  );
};
export default memo(LoginAccount);
