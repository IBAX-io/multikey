import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
const timerCount = 5;
const GasTip = ({ isGas, close }: { isGas: boolean; close: () => void }) => {
  const { t } = useTranslation();
  const [count, setCount] = useState(timerCount);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sendCode = useCallback(() => {
    if (isGas) {
      timerRef.current = setInterval(() => {
        setCount((prevState) => prevState - 1);
      }, 5000);
    }
  }, [isGas]);
  const handleClose = () => {
    close();
  };
  useEffect(() => {
    if (count === 0 && timerRef.current) {
      close();
      clearInterval(timerRef.current);
    } else if (count === 5) {
      sendCode();
    }
  }, [close, count, sendCode]);
  /* useEffect(() => {
    if (isGas) {
      if (count > 0) {
        timerRef.current = setTimeout(() => {
          setCount((prevState) => prevState - 1);
        }, 1000);
      } else {
        close();
        timerRef.current && clearTimeout(timerRef.current);
      }
    }
  }, [close, count, isGas]); */
  return (
    <Dialog
      open={isGas}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
        {t('user.tips')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ fontSize: 12 }}>
          {t('home.gasmin')}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={handleClose}>
          {t('home.know')}({count})
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GasTip;
