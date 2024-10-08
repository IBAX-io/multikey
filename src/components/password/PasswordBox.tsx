import LoadMask from '@/components/loading/LoadMask';
import contract from '@/plugins/lib';
import util from '@/plugins/util';
import {
  Alert,
  Box,
  Button,
  FormControl,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PasswordBox = ({
  isCheck,
  params,
  close,
  confirm
}: {
  isCheck: boolean;
  params: any;
  close: () => void;
  confirm: () => void;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const current = util.getCache('current');
  const [type, setType] = useState('text');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState(t('login.pwEmpty'));
  const [isOpen, setIsOpen] = useState(false);
  const [severity, setSeverity] = useState<'info' | 'success' | 'warning' | 'error'>('error');
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setPassword('');
    setType('');
    close();
  };
  const handleCheckPassword = useCallback(
    (value: string) => {
      if (value == '') {
        setPasswordError(true);
        setPasswordErrorText(t('login.pwEmpty'));
        return false;
      } else if (value !== current!.password) {
        setPasswordError(true);
        setPasswordErrorText(t('login.incorrect'));
        return false;
      } else {
        setPasswordError(false);
        setPasswordErrorText('');
        return true;
      }
    },
    [current, t]
  );
  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setType('password');
    setPassword(event.target.value);
    handleCheckPassword(value);
  };
  const handleSnackbarClose = () => {
    setIsOpen(false);
    setPassword('');
    setPasswordError(false);
    setPasswordErrorText('');
    confirm();
  };
  const handleConfirm = () => {
    try {
      const boo = handleCheckPassword(password);
      if (boo) {
        setLoading(true);
        contract.tokensSend(params, (res: any, status: string) => {
          if (status === 'error') {
            console.log(res);
            setIsOpen(true);
            setSeverity('error');
            setTip(res.errmsg.error);
          } else if (status === 'loading') {
            setIsOpen(true);
            setSeverity('warning');
            setTip(t('user.chain'));
          } else if (status === 'success') {
            setIsOpen(true);
            setSeverity('success');
            setTip(t('user.dosuccess'));
            setPassword('');
            setType('text');
          } else {
            setIsOpen(true);
            setSeverity('error');
            setTip(res.msg);
          }
          console.log(res);
          setLoading(false);
        });
      }
    } catch (error) {
      setIsOpen(true);
      setLoading(false);
      setTip('Network failed');
    }
  };
  return (
    <>
      <Modal
        open={isCheck}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', md: '50%', lg: '30%', xl: '20%' },
            minWidth: 460,
            maxWidth: 600,
            bgcolor: theme.palette.container.main,
            boxShadow: 24,
            p: 2,
            borderRadius: 2
          }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={3}>
            {t('home.check')}
          </Typography>
          <FormControl sx={{ minWidth: 120, width: '100%', mb: 3 }} required>
            <TextField
              required
              label={t('login.password')}
              onChange={handleChangePassword}
              size="medium"
              autoComplete="off"
              inputMode="none"
              variant="outlined"
              color="secondary"
              type={type}
              value={password}
              error={passwordError}
              fullWidth
              helperText={passwordError ? passwordErrorText : ''}
            />
          </FormControl>
          <Stack direction="row" justifyContent="space-around" alignItems="center">
            <Button variant="outlined" onClick={handleClose} size="large">
              {t('login.cancel')}
            </Button>
            <Button variant="filled" onClick={handleConfirm} size="large">
              {t('login.confirm')}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={2000}>
        <Alert onClose={handleSnackbarClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {tip}
        </Alert>
      </Snackbar>
      <LoadMask loading={loading}></LoadMask>
    </>
  );
};
export default PasswordBox;
