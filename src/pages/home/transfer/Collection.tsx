import MainContainer from '@/components/cantainer/MainContainer';
import PasswordBox from '@/components/password/PasswordBox';
import { BalanceList, BalanceType, CountParams, EcomInfoList, HelperType, TeamItem } from '@/dataType';
import keyring from '@/plugins/keyring';
import { handleBatchRequests, handleEcoInfo } from '@/plugins/request/api';
import util from '@/plugins/util';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initMessageSearch } from '@/store/message';
import { getSelectTeam } from '@/store/team';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export const Component = () => {
  const { t } = useTranslation();
  const [ecoInfo, setEcoInfo] = useState<BalanceType | null>(null);
  const [accountHelper, setAccountHelper] = useState<HelperType | null>(null);
  const [amountHelper, setAmountHelper] = useState<HelperType | null>(null);
  const [expedit, setExpedit] = useState('');
  const [expediteNum, setExpediteNum] = useState('');
  const [followFuel, setFollowFuel] = useState(0);
  const [flag, setFlag] = useState(1);
  const [expeditHelper, setExpeditHelper] = useState<HelperType | null>(null);
  const [comment, setComment] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const { id, keyId, tokenSymbol } = useParams();
  const [account, setAccount] = useState(keyring.addressString(keyId!));
  const [amount, setAmount] = useState(useParams().amount);
  const countParams = useMemo(() => {
    const params: CountParams = {
      jsonrpc: '2.0',
      method: 'ibax.getList',
      id: 1,
      params: [
        {
          name: '@1multi_sign_proposals',
          where: `{"wallet": ${teamSelect.wallet},"status": "ongoing"}`,
          limit: 10,
          columns: 'id'
        }
      ]
    };
    return params;
  }, [teamSelect.wallet]);
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
  const ecoParams = useMemo(() => {
    const param = {
      jsonrpc: '2.0',
      method: 'ibax.getList',
      id: 1,
      params: [{ name: '@1ecosystems', where: `{id:${id}}` }]
    };
    return param;
  }, [id]);
  const handleGetEcoInfo = useCallback(async () => {
    const data = (await handleEcoInfo(ecoParams)) as EcomInfoList | null;
    console.log('🚀 ~ file: Transfer.tsx:95 ~ handleGetEcoInfo ~ data:', data);
    if (data && data.list) {
      const info = data.list[0];
      console.log('🚀 ~ file: Transfer.tsx:98 ~ handleGetEcoInfo ~ info:', info);
      if (info.fee_mode_info) {
        console.log(info.fee_mode_info);
        const obj = JSON.parse(info.fee_mode_info) as any;
        if (Number(obj.fee_mode_detail.expedite_fee.flag) === 2) {
          console.log('🚀 ~ file: Transfer.tsx:104 ~ handleGetEcoInfo ~ obj:', obj);
          setFlag(Number(obj.fee_mode_detail.expedite_fee.flag));
          setFollowFuel(Number(obj.follow_fuel));
        }
      }
    }
  }, [ecoParams]);
  useEffect(() => {
    handleBalance();
    handleGetEcoInfo();
  }, [handleBalance, handleGetEcoInfo]);
  const handleVerifyAccount = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('home.recipient'),
          boo: true
        };
        setAccountHelper(helperData);
        return false;
      } else if (!util.validateAddress(value)) {
        const helperData: HelperType = {
          text: t('home.addreeType'),
          boo: true
        };
        setAccountHelper(helperData);
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setAccountHelper(helperData);
        return true;
      }
    },
    [t]
  );
  const handleChangeAccount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAccount(value);
    handleVerifyAccount(value);
  };
  const handleVerifyAmount = useCallback(
    (value: string) => {
      const maxAmount = util.formatUnits(ecoInfo?.amount, ecoInfo?.digits);
      if (Number(value) <= 0) {
        const helperData: HelperType = {
          text: t('home.maxZero'),
          boo: true
        };
        setAmountHelper(helperData);
        return false;
      } else if (util.comparedTo(value, maxAmount)) {
        const helperData: HelperType = {
          text: t('home.maxAmount', { num: maxAmount, tokenSymbol: ecoInfo?.token_symbol }),
          boo: true
        };
        setAmountHelper(helperData);
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setAmountHelper(helperData);
        return true;
      }
    },
    [ecoInfo?.amount, ecoInfo?.digits, ecoInfo?.token_symbol, t]
  );
  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (Number(value) >= 0) {
      setAmount(util.formatDecimalPlaces(value, ecoInfo!.digits));
      handleVerifyAmount(value);
    }
  };
  const handleVerifyExpedit = useCallback(
    (value: string) => {
      const maxAmount = util.formatUnits(ecoInfo?.amount, ecoInfo?.digits);
      const str = value.trim();
      if (str.length > 0) {
        if (Number(value) <= 0) {
          const helperData: HelperType = {
            text: t('home.maxZero'),
            boo: true
          };
          setExpeditHelper(helperData);
          return false;
        } else if (util.comparedTo(value, maxAmount)) {
          const helperData: HelperType = {
            text: t('home.maxAmount', { num: maxAmount, tokenSymbol: ecoInfo?.token_symbol }),
            boo: true
          };
          setExpeditHelper(helperData);
          return false;
        } else {
          const helperData: HelperType = {
            text: '',
            boo: false
          };
          setExpeditHelper(helperData);
          return true;
        }
      } else {
        return true;
      }
    },
    [ecoInfo?.amount, ecoInfo?.digits, ecoInfo?.token_symbol, t]
  );
  const handleChangeExpedit = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (Number(value) >= 0) {
      console.log(followFuel, followFuel * 10 ** ecoInfo!.digits, Number(value) / (followFuel * 10 ** ecoInfo!.digits));
      setExpedit(util.formatDecimalPlaces(value, ecoInfo!.digits));
      const num = util.formatFixed(Number(value) / (followFuel * 10 ** ecoInfo!.digits), 0);
      console.log('🚀 ~ file: Transfer.tsx:254 ~ handleChangeExpedit ~ num:', num);
      setExpediteNum(num);
      handleVerifyExpedit(value);
    }
  };
  const handleChangeTextarea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setComment(value);
  };
  const handleTransfer = () => {
    const checkAccount = handleVerifyAccount(account);
    const checkAmount = handleVerifyAmount(amount!);
    const checkExpedit = handleVerifyExpedit(expedit);
    if (checkAccount && checkAmount && checkExpedit) {
      setIsCheck(true);
    }
  };
  const handleCancel = () => {
    setAccount('');
    setAmount('');
    setExpedit('');
    setComment('');
    setAccountHelper(null);
    setAmountHelper(null);
    setExpeditHelper(null);
  };
  const handleClose = () => {
    setIsCheck(false);
  };
  const handleConfirm = async () => {
    setIsCheck(false);
    await dispatch(initMessageSearch(countParams));
    navigate('/', { replace: true });
  };
  return (
    <MainContainer>
      <Typography variant="h5" mb={3}>
        {t('home.transfer')}
      </Typography>
      <Stack textAlign="center" direction="row" justifyContent="center" mb={2}>
        <Typography variant="h6">{tokenSymbol}</Typography>
        <Typography variant="h6" ml={1}>
          # {id}
        </Typography>
      </Stack>
      <Stack textAlign="center" direction="row" justifyContent="center" mb={2}>
        <Typography variant="h6">{t('home.balance')}:</Typography>
        <Typography variant="h6" ml={1}>
          {util.formatFixed(ecoInfo?.amount, ecoInfo?.digits)}
        </Typography>
        <Typography variant="h6" ml={1}>
          {tokenSymbol}
        </Typography>
      </Stack>
      <Box display="flex" justifyContent="center">
        <Box sx={{ width: { md: '40%', sm: '100%' } }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              htmlFor="outlined-adornment-address"
              required
              sx={{ fontSize: 16 }}
              error={accountHelper ? accountHelper.boo : false}>
              {t('home.send')}
            </InputLabel>
            <OutlinedInput
              fullWidth
              disabled
              placeholder={t('home.recipient')}
              size="medium"
              autoComplete="off"
              value={account}
              id="outlined-adornment-address"
              onChange={handleChangeAccount}
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              label={t('home.send')}
              error={accountHelper ? accountHelper.boo : false}
            />
            <FormHelperText error={true}>{accountHelper ? accountHelper.text : ''}</FormHelperText>
          </FormControl>
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
              placeholder={t('home.dir')}
              type="InputNumber"
              autoComplete="off"
              size="medium"
              fullWidth
              value={amount}
              onChange={handleChangeAmount}
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              label={t('home.count')}
              error={amountHelper ? amountHelper.boo : false}
            />
            <FormHelperText error={true}>{amountHelper ? amountHelper.text : ''}</FormHelperText>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel htmlFor="outlined-adornment-comment" sx={{ fontSize: 16 }}>
              {t('home.comment')}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-comment"
              placeholder={t('home.commentInput')}
              fullWidth
              multiline
              autoComplete="off"
              minRows={3}
              maxRows={5}
              value={comment}
              onChange={handleChangeTextarea}
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              label={t('home.comment')}
              inputProps={{ maxLength: 150 }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              htmlFor="outlined-adornment-expedit"
              sx={{ fontSize: 16 }}
              error={expeditHelper ? expeditHelper.boo : false}>
              {t('home.expedit')}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-expedit"
              placeholder={t('home.expeditInput')}
              type="InputNumber"
              size="medium"
              autoComplete="off"
              fullWidth
              value={expedit}
              onChange={handleChangeExpedit}
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              label={t('home.expedit')}
              error={expeditHelper ? expeditHelper.boo : false}
            />
            <FormHelperText error={true}>{expeditHelper ? expeditHelper.text : ''}</FormHelperText>
          </FormControl>
          {flag === 2 && Number(expediteNum) !== 0 ? (
            <Stack direction="row" mb={3} alignItems="center">
              <Typography mr={0.5} variant="body2">
                {t('home.expedited')}:
              </Typography>
              <Typography variant="body2">
                {expedit} {tokenSymbol}
              </Typography>
              <Typography mx={0.5}>≈</Typography>
              <Typography variant="body2" mr={1}>
                {expediteNum} IBXC
              </Typography>
              <Tooltip title={t('user.urgentpay')} placement="bottom">
                <HelpOutlineIcon fontSize="medium" sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Stack>
          ) : (
            ''
          )}
          <Stack direction="row" justifyContent="space-around">
            <Button variant="outlined" onClick={handleCancel} sx={{ width: '40%' }} size="large">
              {t('login.cancel')}
            </Button>
            <Button variant="filled" onClick={handleTransfer} sx={{ width: '40%' }} size="large">
              {t('login.confirm')}
            </Button>
          </Stack>
        </Box>
      </Box>
      <PasswordBox
        isCheck={isCheck}
        params={{
          contractName: 'MultiSignPropose',
          Wallet: keyring.addressString(keyId!),
          To: account,
          Amount: util.parseUnits(amount, Number(ecoInfo?.digits)),
          digits: Number(ecoInfo?.digits),
          Ecosystem: id,
          Expedite: String(expedit) ? String(expedit) : '0',
          Proposal: comment
        }}
        close={handleClose}
        confirm={handleConfirm}></PasswordBox>
    </MainContainer>
  );
};

Component.displayName = 'CollectionPage';
