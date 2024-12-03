import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  styled,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
const BootstrapDialog = styled(Dialog)(({ theme }) => {
  const isSmUp = useMediaQuery(theme.breakpoints.up('md'));
  return {
    '&': {
      width: isSmUp ? '40%' : '95%',
      margin: 'auto',
      padding: 0
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      width: '100%'
      // minHeight: isSmUp ? '60vh' : '40vh',
      //   maxHeight: isSmUp ? '60vh' : '40vh'
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(2)
    }
  };
});
const href = 'https://www.jutkey.com';
const ExtendTip = ({ isTip, closeDialog }: { isTip: boolean; closeDialog: () => void }) => {
  const { t } = useTranslation();
  const handleTokenClose = () => {
    closeDialog();
  };
  return (
    <BootstrapDialog fullWidth={true} onClose={handleTokenClose} aria-labelledby="customized-dialog-title" open={isTip}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ m: 0, p: 2, fontSize: 14 }} id="jutkey-customized-dialog-title">
          {t('nav.wallet')}
        </DialogTitle>
        <IconButton aria-label="close" onClick={handleTokenClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent dividers>
        <Typography
          variant="inherit"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: 3
          }}>
          <Avatar alt="jutkey" src="/logo-128.png" sx={{ width: 120, height: 120 }} />
        </Typography>
        <Typography variant="body2" textAlign="center" m={3}>
          {t('nav.chain')}
        </Typography>
        <Typography variant="inherit" m={5}>
          <Button
            component={Link}
            to={href}
            target="_blank"
            variant="filled"
            sx={{
              width: '50%',
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              textTransform: 'capitalize'
            }}>
            {t('nav.des')}
          </Button>
        </Typography>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default ExtendTip;
