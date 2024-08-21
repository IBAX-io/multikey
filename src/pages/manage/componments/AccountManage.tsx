import { AccountItem, AccountList, HelperType } from '@/dataType';
import ethers from '@/plugins/ethers';
import keyring from '@/plugins/keyring';
import util from '@/plugins/util';
import {
  Alert,
  Box,
  Button,
  FormControl,
  List,
  ListItem,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AccountManage = () => {
  const { t } = useTranslation();
  const [accountList, setAccountList] = useState<AccountList | null>(null);
  const [current, setCurrent] = useState<AccountItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [name, setName] = useState('');
  const [nameHelper, setNameHelper] = useState<HelperType | null>(null);
  const handleVerifyName = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('home.inputAccount'),
          boo: true
        };
        setNameHelper(helperData);
        return false;
      } /* else if (str.length > 20) {
        const helperData: HelperType = {
          text: t('home.nameLength'),
          boo: true
        };
        setNameHelper(helperData);
        return false;
      } */ else {
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
    setName(value);
    handleVerifyName(value);
  };
  const handleAddAccount = () => {
    if (isAdd) {
      setIsOpen(true);
    } else {
      setIsAdd(true);
    }
  };
  const handleConfirm = async () => {
    const boo = handleVerifyName(name);
    const hasher = util.getCache('hasher');
    const getKeyring = keyring.getKeyring(hasher)!;
    if (boo) {
      const item = accountList![accountList!.length - 1];
      console.log('🚀 ~ file: AccountManage.tsx:55 ~ handleConfirm ~ item:', item);
      const indexAdd = item.index! + 1;
      const { privateKey } = ethers.wallet(item.mnemonic!, indexAdd);
      const publicKey = ethers.publicKey(privateKey) as string;
      const keyId = getKeyring.publicToID(publicKey);
      const account = keyring.addressString(keyId);
      const obj = {
        id: util.uuid(),
        index: indexAdd,
        selectId: current!.selectId,
        name,
        mnemonic: item.mnemonic,
        password: item.password,
        networkId: current!.networkId,
        privateKey,
        publicKey,
        account,
        isShow: true,
        isLogin: false
      };
      accountList!.push(obj);
      setAccountList(() => {
        return [...accountList!];
      });
      util.setCache(`${current!.mnemonic}-${current!.selectId}`, accountList);
      setIsAdd(false);
      setName('');
    }
  };
  const handleBarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
  };
  const handleCloseAccount = async (id: string) => {
    if (accountList) {
      const list = accountList.map((item: AccountItem) => {
        if (item.id === id) {
          item.isShow = false;
        }
        return item;
      });
      setAccountList(() => {
        return [...list!];
      });
      util.setCache(`${current!.mnemonic}-${current!.selectId}`, list);
    }
  };
  const handleContinueAccount = async (id: string) => {
    if (accountList) {
      const list = accountList.map((item: AccountItem) => {
        if (item.id === id) {
          item.isShow = true;
        }
        return item;
      });
      setAccountList(() => {
        return [...list!];
      });
      util.setCache(`${current!.mnemonic}-${current!.selectId}`, list);
    }
  };
  useEffect(() => {
    const handleCurrentData = () => {
      const currentData = util.getCache('current') as AccountItem;
      try {
        const accountData = util.getCache(`${currentData.mnemonic}-${currentData.selectId}`);
        setAccountList(accountData);
        console.log('🚀 ~ file: AccountManage.tsx:121 ~ handleCurrentData ~ accountData:', accountData);
        setCurrent(currentData);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    };
    handleCurrentData();
  }, []);
  return (
    <Box mb={3}>
      <Typography variant="h6" mb={1}>
        {t('login.loacl')}
      </Typography>
      <Typography variant="body2" mb={3}>
        {t('login.now')}
      </Typography>
      <List sx={{ maxHeight: '300px', overflowY: 'auto', width: { md: '80%', sm: '100%' } }}>
        {accountList
          ? accountList.map((item: AccountItem) => {
              return (
                <ListItem key={item.id} sx={{ mb: 2, p: 0 }}>
                  <Tooltip title={item.name} placement="bottom-start">
                    <Typography
                      width="60%"
                      variant="body2"
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}>
                      {item.name}
                    </Typography>
                  </Tooltip>
                  {item.isLogin ? (
                    <Button
                      disabled={item.isLogin}
                      variant="text"
                      sx={{ mx: 1, minWidth: 150, lineHeight: 2.4 }}
                      size="large">
                      {t('manage.current')}
                    </Button>
                  ) : item.isShow ? (
                    <Button
                      variant="outlined"
                      sx={{ mx: 1, minWidth: 150, lineHeight: 2.4 }}
                      onClick={() => {
                        handleCloseAccount(item.id);
                      }}
                      size="large">
                      {t('manage.close')}
                    </Button>
                  ) : (
                    <Button
                      sx={{ mx: 1, minWidth: 150, lineHeight: 2.4 }}
                      variant="filled"
                      onClick={() => {
                        handleContinueAccount(item.id);
                      }}
                      size="large">
                      {t('manage.use')}
                    </Button>
                  )}
                </ListItem>
              );
            })
          : ''}
      </List>
      {isAdd ? (
        <FormControl sx={{ width: { md: '80%', sm: '100%' }, display: 'block', mb: 1 }}>
          <Stack direction="row">
            <TextField
              sx={{
                width: '60%'
              }}
              placeholder={t('home.inputAccount')}
              size="medium"
              fullWidth
              autoComplete="off"
              value={name}
              variant="standard"
              onChange={handleChangeName}
              error={nameHelper ? nameHelper.boo : false}
              helperText={nameHelper ? nameHelper.text : ''}
            />
            <Button
              variant="outlined"
              sx={{ mx: 1, minWidth: 150, lineHeight: 2.4 }}
              onClick={handleConfirm}
              size="large">
              {t('login.confirm')}
            </Button>
          </Stack>
        </FormControl>
      ) : (
        ''
      )}
      <Box>
        <Button variant="filled" sx={{ mx: 1, minWidth: 150, lineHeight: 2.4 }} onClick={handleAddAccount} size="large">
          {t('manage.add')}
        </Button>
      </Box>
      <Snackbar
        open={isOpen}
        autoHideDuration={3000}
        onClose={handleBarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleBarClose} severity="warning" sx={{ width: '100%' }}>
          {t('manage.create')}
        </Alert>
      </Snackbar>
    </Box>
  );
};
export default AccountManage;
