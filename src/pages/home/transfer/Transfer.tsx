import MainContainer from '@/components/cantainer/MainContainer';
import PasswordBox from '@/components/password/PasswordBox';
import {
  BalanceList,
  BalanceType,
  CountParams,
  EcomInfoList,
  EcoType,
  EcoTypeList,
  HelperType,
  TeamItem
} from '@/dataType';
import keyring from '@/plugins/keyring';
import { handleBatchRequests, handleEcoInfo } from '@/plugins/request/api';
import util from '@/plugins/util';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initMessageSearch } from '@/store/message';
import { getSelectTeam } from '@/store/team';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ImageIcon from '@mui/icons-material/Image';
import type { SelectChangeEvent } from '@mui/material';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
const arrType = [
  {
    label: 'address',
    value: 'address'
  },

  {
    label: 'iName',
    value: 'iName'
  }
];
const win = window;
export const Component = () => {
  const { t } = useTranslation();
  const [type, setType] = useState('address');
  const [ecoInfo, setEcoInfo] = useState<BalanceType | null>(null);
  const [account, setAccount] = useState('');
  const [accountHelper, setAccountHelper] = useState<HelperType | null>(null);
  const [amount, setAmount] = useState('');
  const [amountHelper, setAmountHelper] = useState<HelperType | null>(null);
  const [expedit, setExpedit] = useState('');
  const [expediteNum, setExpediteNum] = useState('');
  const [followFuel, setFollowFuel] = useState(0);
  const [flag, setFlag] = useState(1);
  const [expeditHelper, setExpeditHelper] = useState<HelperType | null>(null);
  const [comment, setComment] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const [ecoList, setEcoList] = useState<EcoTypeList | null>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const { id, keyId, tokenSymbol } = useParams();
  const [ecoId, setEcoId] = useState(id);
  const [tipInfo, setTipInfo] = useState(t('home.recipient'));
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
      if (info.fee_mode_info !== 'NULL') {
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
  const handleBalance = useCallback(async () => {
    const data = (await handleBatchRequests(balanceParams)) as BalanceList | null;
    console.log('🚀 ~ file: Record.tsx:55 ~ handleBalance ~ data:', data);
    if (data && data[0].result) {
      const balacne = data[0].result;
      setEcoInfo(balacne);
    }
  }, [balanceParams]);
  useEffect(() => {
    handleBalance();
    handleGetEcoInfo();
  }, [handleBalance, handleGetEcoInfo]);
  const handleVerifyAccount = useCallback(
    (value: string) => {
      const str = value.trim();
      const iNameRule = /^[\w]{4,20}$/;
      if (type === 'address') {
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
      } else {
        if (str.length <= 0) {
          const helperData: HelperType = {
            text: t('home.iName'),
            boo: true
          };
          setAccountHelper(helperData);
          return false;
        } else if (!iNameRule.test(value)) {
          const helperData: HelperType = {
            text: t('home.nickname'),
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
      }
    },
    [t, type]
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
    console.log(Number(value) >= 0);
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
    const checkAmount = handleVerifyAmount(amount);
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
  const handleTypeChange = async (event: SelectChangeEvent) => {
    const { value } = event.target;
    const helperData: HelperType = {
      text: '',
      boo: false
    };
    setAccount('');
    setAccountHelper(helperData);
    setType(event.target.value as string);
    if (value === 'address') {
      setTipInfo(t('home.recipient'));
    } else {
      setTipInfo(t('home.iName'));
    }
  };
  const handleTokenChange = async (event: SelectChangeEvent) => {
    const value = event.target.value;
    console.log('🚀 ~ file: Transfer.tsx:311 ~ handleLangChange ~ value:', value);
    const obj = ecoList?.find((item: EcoType) => Number(item.id) === Number(value));
    setEcoId(value);
    navigate(`/transfer/${obj?.tokenSymbol}/${value}/${keyId}`, { replace: true });
    win.location.reload();
  };
  useEffect(() => {
    const handleStorageEcoListData = () => {
      const ecoListData = util.getCache(`${teamSelect.wallet}-all`) || [];
      console.log('🚀 ~ file: Transfer.tsx:332 ~ handleStorageEcoListData ~ ecoListData:', ecoListData);
      if (ecoListData.length) {
        setEcoList(ecoListData);
      }
    };
    handleStorageEcoListData();
  }, [teamSelect.wallet]);
  return (
    <MainContainer>
      <Typography variant="h5" mb={3}>
        {t('home.transfer')}
      </Typography>
      <Stack textAlign="center" direction="row" justifyContent="center">
        {ecoList && ecoList?.length ? (
          <Select
            sx={{
              '& fieldset': {
                border: 'none'
              },
              '& .MuiInputBase-input.MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: (theme) => theme.palette.onBody.main
              },
              '& .MuiTypography-root': {
                mr: 1
              }
            }}
            size="medium"
            MenuProps={{
              style: {
                maxHeight: 400
              }
            }}
            labelId="token-simple-select-label"
            id="token-simple-select"
            value={ecoId}
            onChange={handleTokenChange}>
            {ecoList.map((item: EcoType) => {
              return (
                <MenuItem key={item.id} value={item.id} sx={{ mb: 1 }}>
                  <Stack flexGrow={0} direction="row" alignItems="center">
                    {item.id === 1 ? (
                      <Avatar src="/logo-big.png" sx={{ width: 30, height: 30 }}>
                        <ImageIcon />
                      </Avatar>
                    ) : (
                      <>
                        {item.logoURI ? (
                          <Avatar src={item.logoURI} sx={{ width: 30, height: 30 }}></Avatar>
                        ) : (
                          <Avatar sx={{ width: 30, height: 30 }}>
                            <ImageIcon fontSize="medium" />
                          </Avatar>
                        )}
                      </>
                    )}
                    <ListItemText primary={`${item.tokenSymbol}#${item.id}`} sx={{ ml: 1 }} />
                  </Stack>
                </MenuItem>
              );
            })}
          </Select>
        ) : (
          ''
        )}
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
        <Box sx={{ width: { md: '60%', sm: '100%' } }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel
              variant="outlined"
              htmlFor="outlined-adornment-address"
              required
              sx={{ fontSize: 16 }}
              error={accountHelper ? accountHelper.boo : false}>
              {t('home.send')}
            </InputLabel>
            <OutlinedInput
              fullWidth
              placeholder={tipInfo}
              size="medium"
              autoComplete="off"
              value={account}
              id="outlined-adornment-address"
              onChange={handleChangeAccount}
              startAdornment={<InputAdornment position="start"></InputAdornment>}
              sx={{
                paddingRight: 0
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Select
                    labelId="lang-select-helper-label"
                    id="type-select-helper"
                    value={type}
                    size="medium"
                    placeholder=""
                    onChange={handleTypeChange}
                    inputProps={{
                      name: 'languages',
                      id: 'uncontrolled-native'
                    }}
                    sx={{
                      border: 'none',
                      ':before': {
                        borderColor: 'divider'
                      },
                      bgcolor: 'secondary.light',
                      fontStyle: 'italic'
                    }}>
                    {arrType.map(({ value, label }) => (
                      <MenuItem value={value} key={value} sx={{ mt: 1 }}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </InputAdornment>
              }
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
              minRows={2}
              maxRows={2}
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
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ width: '40%', minWidth: 120, lineHeight: 2.4 }}
              size="large">
              {t('login.cancel')}
            </Button>
            <Button
              variant="filled"
              onClick={handleTransfer}
              sx={{ width: '40%', minWidth: 120, lineHeight: 2.4 }}
              size="large">
              {t('login.confirm')}
            </Button>
          </Stack>
        </Box>
      </Box>
      {type === 'address' ? (
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
      ) : (
        <PasswordBox
          isCheck={isCheck}
          params={{
            contractName: 'MultiSignPropose',
            Wallet: keyring.addressString(keyId!),
            iName: account,
            Amount: util.parseUnits(amount, Number(ecoInfo?.digits)),
            digits: Number(ecoInfo?.digits),
            Ecosystem: id,
            Expedite: String(expedit) ? String(expedit) : '0',
            Proposal: comment
          }}
          close={handleClose}
          confirm={handleConfirm}></PasswordBox>
      )}
    </MainContainer>
  );
};
