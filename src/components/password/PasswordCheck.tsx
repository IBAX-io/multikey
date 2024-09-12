import util from '@/plugins/util';
import { Box, Button, FormControl, Modal, Stack, TextField, Typography, useTheme } from '@mui/material';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PasswordBox = ({ isCheck, close, confirm }: { isCheck: boolean; close: () => void; confirm: () => void }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [type, setType] = useState('text');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState(t('login.pwEmpty'));
  const handleClose = () => {
    setPassword('');
    setPasswordError(false);
    setPasswordErrorText('');
    setType('');
    close();
  };
  const handleCheckPassword = useCallback(
    (value: string) => {
      const current = util.getCache('current');
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
    [t]
  );
  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setType('password');
    setPassword(event.target.value);
    handleCheckPassword(value);
  };
  const handleConfirm = () => {
    const boo = handleCheckPassword(password);
    if (boo) {
      setPassword('');
      setType('text');
      confirm();
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
            bgcolor: theme.palette.container.main,
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
            minWidth: 460,
            maxWidth: 600,
            width: { xs: '90%', md: '50%', lg: '30%', xl: '20%' }
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
    </>
  );
};
export default PasswordBox;
