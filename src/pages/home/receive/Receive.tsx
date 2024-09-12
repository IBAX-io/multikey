import MainContainer from '@/components/cantainer/MainContainer';
import { BalanceList, BalanceType, HelperType, TeamItem } from '@/dataType';
import keyring from '@/plugins/keyring';
import { handleBatchRequests } from '@/plugins/request/api';
import util from '@/plugins/util';
import { useAppSelector } from '@/store/hooks';
import { getSelectTeam } from '@/store/team';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  Snackbar,
  Stack,
  Typography
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton
} from 'react-share';

export const Component = () => {
  const { t } = useTranslation();
  const currentUrl = window.location.protocol + '//' + window.location.host;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  console.log('🚀 ~ file: Receive.tsx:33 ~ Component ~ currentUrl:', currentUrl);
  const { id, keyId, tokenSymbol } = useParams();
  const [qrValue, setQrValue] = useState(currentUrl);
  const [ecoInfo, setEcoInfo] = useState<BalanceType | null>(null);
  const [amount, setAmount] = useState('');
  const [amountHelper, setAmountHelper] = useState<HelperType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const handleQrValue = useCallback(() => {
    setQrValue(`${currentUrl}/collection/${tokenSymbol}/${id}/${keyId}/${amount || 0}`);
  }, [amount, currentUrl, id, keyId, tokenSymbol]);
  const balanceParams = useMemo(() => {
    const address = keyring.addressString(keyId!);
    const params = [
      {
        jsonrpc: '2.0',
        method: 'ibax.getBalance',
        id: 1,
        params: [address, Number(id)]
      }
    ];
    return params;
  }, [id, keyId]);
  const handleBalance = useCallback(async () => {
    const data = (await handleBatchRequests(balanceParams)) as BalanceList | null;
    // console.log('🚀 ~ file: Record.tsx:55 ~ handleBalance ~ data:', data);
    if (data && data[0].result) {
      const balacne = data[0].result;
      setEcoInfo(balacne);
    }
  }, [balanceParams]);
  useEffect(() => {
    handleBalance();
  }, [handleBalance]);
  useEffect(() => {
    handleQrValue();
  }, [handleQrValue]);
  const handleVerifyAmount = useCallback(
    (value: string) => {
      // const maxAmount = util.formatUnits(ecoInfo?.amount, ecoInfo?.digits);
      if (Number(value) < 0) {
        const helperData: HelperType = {
          text: t('home.maxZero'),
          boo: true
        };
        setAmountHelper(helperData);
        return false;
      } /* if (util.comparedTo(value, maxAmount)) {
        const helperData: HelperType = {
          text: t('home.maxAmount', { num: maxAmount, tokenSymbol: ecoInfo?.token_symbol }),
          boo: true
        };
        setAmountHelper(helperData);
        return false;
      } else */ else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setAmountHelper(helperData);
        return true;
      }
    },
    [t]
  );
  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (Number(value) >= 0) {
      setAmount(util.formatDecimalPlaces(value, ecoInfo!.digits));
      const boo = handleVerifyAmount(value);
      if (boo) {
        setQrValue(() => {
          return `${currentUrl}/collection/${tokenSymbol}/${id}/${keyId}/${amount}`;
        });
      }
    }
  };
  const handleSnackbarClose = () => {
    setIsOpen(false);
  };
  const handleCodyQrValue = () => {
    setIsOpen(true);
    console.log(qrValue);
    util.copyToClipboard(qrValue);
  };
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',') as any;
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
  const downloadFile = (url: string, name: string) => {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', name);
    a.setAttribute('target', '_blank');
    a.dispatchEvent(new MouseEvent('click'));
  };

  const handleDownLoadQRCode = () => {
    const boo = handleVerifyAmount(amount);
    if (boo) {
      const Qr = document.getElementById('qrCode') as any;
      const canvasUrl = Qr!.toDataURL('image/png');
      const myBlob = dataURLtoBlob(canvasUrl);
      const myUrl = URL.createObjectURL(myBlob);
      downloadFile(myUrl, 'qrCode');
    }
  };
  const handleNavigator = () => {
    util.copyToClipboard(teamSelect.wallet);
    setIsOpen(true);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id1 = open ? 'simple-popper' : undefined;
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainContainer>
      <Typography variant="h5" mb={3}>
        {t('home.receive')}
      </Typography>
      <Box sx={{ width: { md: '80%', sm: '100%' } }} textAlign="center" m="auto" mb={2}>
        <Typography variant="body1" mb={1}>
          {teamSelect.team_name}
        </Typography>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Typography variant="body1">{teamSelect.wallet}</Typography>
          <IconButton aria-label="ContentCopyIcon" onClick={handleNavigator} size="medium" color="primary">
            <ContentCopyIcon fontSize="medium" />
          </IconButton>
        </Stack>
      </Box>
      <Stack direction="row" justifyContent="center" alignItems="center" mb={3}>
        <Box>
          <QRCodeCanvas
            id="qrCode"
            value={qrValue}
            size={128}
            imageSettings={{
              excavate: true,
              src: '',
              width: 30,
              height: 30
            }}
          />
        </Box>
      </Stack>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { md: '80%', sm: '100%' } }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              htmlFor="outlined-adornment-count"
              required
              sx={{ fontSize: 16 }}
              error={amountHelper ? amountHelper.boo : false}>
              {t('home.count')}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-count"
              placeholder={t('home.collection')}
              type="InputNumber"
              autoComplete="off"
              size="medium"
              fullWidth
              value={amount}
              onChange={handleChangeAmount}
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              endAdornment={<InputAdornment position="end">{tokenSymbol}</InputAdornment>}
              label={t('home.count')}
              error={amountHelper ? amountHelper.boo : false}
            />
            <FormHelperText error={true}>{amountHelper ? amountHelper.text : ''}</FormHelperText>
          </FormControl>
          <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
            <Button
              color="primary"
              variant="filled"
              size="large"
              onClick={handleDownLoadQRCode}
              sx={{ fontSize: 12, px: 2, minWidth: 120, lineHeight: 2.4, height: 52 }}>
              {t('home.saveqr')}
            </Button>
            <Button
              color="primary"
              variant="filled"
              size="large"
              onClick={handleCodyQrValue}
              sx={{ fontSize: 12, px: 2, minWidth: 120, lineHeight: 2.4, height: 52 }}>
              {t('home.cody')}
            </Button>
            <Button
              color="primary"
              variant="filled"
              size="large"
              sx={{ fontSize: 12, px: 2, minWidth: 120, lineHeight: 2.4, height: 52 }}
              aria-describedby={id1}
              onClick={handleClick}>
              {t('home.give')}
            </Button>
          </Stack>
        </Box>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}>
        <Box p={2} display="flex" width={200} justifyContent="space-between">
          <FacebookShareButton url={qrValue}>
            <FacebookIcon size={30} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton url={qrValue}>
            <LinkedinIcon size={30} round={true} />
          </LinkedinShareButton>
          <RedditShareButton url={qrValue}>
            <RedditIcon size={30} round={true} />
          </RedditShareButton>
          <TelegramShareButton url={qrValue}>
            <TelegramIcon size={30} round={true} />
          </TelegramShareButton>
          <TwitterShareButton url={qrValue}>
            <TwitterIcon size={30} round={true} />
          </TwitterShareButton>
        </Box>
      </Popover>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={2000}>
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {t('login.cody')}
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};

Component.displayName = 'ReceivePage';
