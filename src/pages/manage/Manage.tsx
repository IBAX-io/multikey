import MainContainer from '@/components/cantainer/MainContainer';
import PasswordCheck from '@/components/password/PasswordCheck';
import { AccountItem } from '@/dataType';
import util from '@/plugins/util';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, Box, Button, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AccountManage from './componments/AccountManage';
import ChangeLanguage from './componments/ChangeLanguage';
import ChangePassword from './componments/ChangePassword';

const win = window;
export const Component = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<AccountItem | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isMnemonic, setIsMnemonic] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [mark, setMark] = useState<'mnemonic' | 'private' | 'cleanAccount'>('mnemonic');
  const [tip, setTip] = useState(t('login.cody'));
  const passwordRef = useRef();
  const handleSnackbarClose = () => {
    setIsOpen(false);
    if (passwordRef.current) {
      const objChild = passwordRef.current as any;
      objChild.handleCancel();
    }
  };
  const handleShowMnemonic = () => {
    setMark('mnemonic');
    if (!isCheck && !isMnemonic) {
      setIsCheck(true);
    }
    if (isMnemonic) {
      setIsMnemonic(false);
    }
  };
  const handleClose = () => {
    setIsCheck(false);
  };
  const handleShowPrivate = () => {
    setMark('private');
    if (!isCheck && !isPrivate) {
      setIsCheck(true);
    }
    if (isPrivate) {
      setIsPrivate(false);
    }
  };
  const handleSuccess = () => {
    setIsOpen(true);
    setTip(t('manage.success'));
    win.location.reload();
  };
  const handleImportPrivate = () => {
    const filename = `privateKey.txt`;
    const blob = new Blob([current!.privateKey], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  };
  const handleImportMnemonic = () => {
    const filename = `mnemonic.txt`;
    const blob = new Blob([current!.mnemonic!], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  };
  useEffect(() => {
    const handleCurrentData = () => {
      const accountData = util.getCache('current') as AccountItem;
      try {
        setCurrent(accountData);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    };
    handleCurrentData();
  }, []);
  const handleExit = () => {
    util.removeCacheToken('token');
    util.removeCache('teamSelect');
    if (current?.mnemonic) {
      const accountData = util.getCache(`${current.mnemonic}-${current.selectId}`) || [];
      const arr = accountData.map((item: AccountItem) => {
        if (item.index === 0) {
          item.isLogin = true;
        } else {
          item.isLogin = false;
        }
        return item;
      });
      util.setCache(`${current.mnemonic}-${current.selectId}`, arr);
    }
    win.location.href = '/login';
  };
  const handleChecKClean = () => {
    setMark('cleanAccount');
    if (!isCheck) {
      setIsCheck(true);
    }
  };
  const handleClean = () => {
    const accountList = util.getCache('accountList') || [];
    console.log(current);
    console.log('🚀 ~ file: Manage.tsx:96 ~ handleClean ~ accountList:', accountList);
    const arr = accountList.filter((item: AccountItem) => item.id !== current!.selectId);
    util.setCache('accountList', arr);
    util.removeCacheToken('token');
    if (current?.mnemonic) {
      util.removeCache(`${current.mnemonic}-${current.selectId}`);
    }
    win.location.href = '/login';
  };
  const handleConfirm = () => {
    setIsCheck(false);
    if (mark === 'mnemonic') {
      setIsMnemonic(true);
      return false;
    }
    if (mark === 'private') {
      setIsPrivate(true);
      return false;
    }
    if (mark === 'cleanAccount') {
      handleClean();
    }
  };
  return (
    <MainContainer>
      <Typography variant="h5" mb={3}>
        {t('nav.manage')}
      </Typography>
      {current && current.mnemonic ? <AccountManage></AccountManage> : ''}
      <ChangePassword ref={passwordRef} success={handleSuccess}></ChangePassword>
      {current && current.mnemonic ? (
        <Box mb={2}>
          <Typography variant="h6" mb={1}>
            {t('manage.phrase')}
          </Typography>
          <Typography variant="body2" mb={2}>
            {t('manage.custody')}
          </Typography>
          {isMnemonic ? (
            <Stack direction="row">
              <Alert severity="success" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                {current.mnemonic}
                <IconButton
                  aria-label="ContentCopyIcon"
                  onClick={() => {
                    setIsOpen(true);
                    util.copyToClipboard(current!.mnemonic!);
                    setTip(t('login.cody'));
                  }}
                  size="medium">
                  <ContentCopyIcon />
                </IconButton>
              </Alert>
            </Stack>
          ) : (
            ''
          )}
          <Stack direction="row">
            <Button variant="filled" onClick={handleShowMnemonic} sx={{ minWidth: 150  }} size="large">
              {isMnemonic ? t('manage.hide') : t('manage.show')}
            </Button>
            {isMnemonic ? (
              <Button variant="filled" onClick={handleImportMnemonic} sx={{ mx: 5,minWidth: 150  }} size="large">
                {t('manage.import')}
              </Button>
            ) : (
              ''
            )}
          </Stack>
        </Box>
      ) : (
        ''
      )}
      <Box mb={2}>
        <Typography variant="h6" mb={1}>
          {t('manage.private')}
        </Typography>
        <Typography variant="body2" mb={2}>
          {t('manage.custodyKey')}
        </Typography>
        {isPrivate ? (
          <Stack direction="row">
            <Alert severity="success" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              {current!.privateKey}
              <IconButton
                aria-label="ContentCopyIcon"
                onClick={() => {
                  setIsOpen(true);
                  util.copyToClipboard(current!.privateKey);
                }}
                size="medium">
                <ContentCopyIcon />
              </IconButton>
            </Alert>
          </Stack>
        ) : (
          ''
        )}
        <Stack direction="row">
          <Button variant="filled" onClick={handleShowPrivate} sx={{ minWidth: 150  }} size="large">
            {isPrivate ? t('manage.hidePrivate') : t('manage.showPrivate')}
          </Button>
          {isPrivate ? (
            <Button variant="filled" onClick={handleImportPrivate} sx={{ mx: 5,minWidth: 150  }} size="large">
              {t('manage.import')}
            </Button>
          ) : (
            ''
          )}
        </Stack>
      </Box>
      <Box mb={3}>
        <Typography variant="h6" mb={2}>
          {t('manage.language')}
        </Typography>
        <Typography variant="body2" mb={2}>
          {t('manage.select')}
        </Typography>
        <ChangeLanguage></ChangeLanguage>
      </Box>
      <Box mb={3}>
        <Typography variant="h6" mb={2}>
          {t('manage.help')}
        </Typography>
        <Typography variant="body2" mb={2}>
          {t('manage.user')}
        </Typography>
      </Box>
      <Box mb={3}>
        <Typography variant="h6" mb={2}>
          {t('manage.about')}
        </Typography>
        <Typography variant="body2" mb={2}>
          {t('manage.open')}
        </Typography>
      </Box>
      <Box mb={3}>
        <Button variant="filled" sx={{ mb: 2 , minWidth: 150}} onClick={handleChecKClean} size="large">
          {t('manage.clean')}
        </Button>
        <Typography variant="body2" mb={2}>
          {t('manage.all')}
        </Typography>
      </Box>
      <Box mb={3}>
        <Button variant="filled" sx={{  minWidth: 150}} onClick={handleExit} size="large">
          {t('exit')}
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={2000}>
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {tip}
        </Alert>
      </Snackbar>
      <PasswordCheck isCheck={isCheck} close={handleClose} confirm={handleConfirm}></PasswordCheck>
    </MainContainer>
  );
};
