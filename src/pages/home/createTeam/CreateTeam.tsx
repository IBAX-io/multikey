import MainContainer from '@/components/cantainer/MainContainer';
import PasswordBox from '@/components/password/PasswordBox';
import { BalanceParams, HelperType, TeamItem, TeamParams } from '@/dataType';
import { handleEcoBalance } from '@/plugins/request/api';
import util from '@/plugins/util';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSelectTeam, initTeamSearch, teamSelectData, teamUpdateOne } from '@/store/team';
import Add from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  Alert,
  Box,
  Button,
  Fab,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Snackbar,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Component = () => {
  const current = util.getCache('current');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [num, setNum] = useState<string | number>(2);
  const [arrAddress, setArrAddress] = useState<string[]>([current.account, '', '']);
  const [nameHelper, setNameHelper] = useState<HelperType | null>(null);
  const [numHelper, setNumHelper] = useState<HelperType | null>(null);
  const [addressHelper, setAddressHelper] = useState<HelperType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tip, setTip] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const [isContinue, setIsContinue] = useState(true);
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const [isAmount, setIsAmount] = useState(true);
  const dispatch = useAppDispatch();
  const balanceParams = useMemo(() => {
    const params: BalanceParams = [
      {
        jsonrpc: '2.0',
        method: 'ibax.getBalance',
        id: 1,
        params: [teamSelect.wallet, 1]
      }
    ];
    return params;
  }, [teamSelect.wallet]);
  const handleBalanceParams = useCallback(async () => {
    if (teamSelect.wallet) {
      const res = await handleEcoBalance(balanceParams);

      if (res) {
        const num = util.formatUnits(res[0].result.amount, res[0].result.digits);
        console.log('🚀 ~ file: CreateTeam.tsx:61 ~ handleBalanceParams ~ num:', num);
        setIsAmount(util.greaterThanZero(num, 0));
      }
    }
  }, [balanceParams, teamSelect.wallet]);
  useEffect(() => {
    handleBalanceParams();
  }, [handleBalanceParams]);
  const handleVerifyName = useCallback(
    (value: string) => {
      const str = value.trim();
      if (str.length <= 0) {
        const helperData: HelperType = {
          text: t('home.inputName'),
          boo: true
        };
        setNameHelper(helperData);
        return false;
      } else if (str.length > 20) {
        const helperData: HelperType = {
          text: t('home.nameLength'),
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
  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setName(value);
    handleVerifyName(value);
  };
  const handleVerifyAddress = useCallback(
    (value: string, i: number) => {
      const str = value.trim();
      if (str.length <= 0) {
        setAddressHelper(() => {
          const helperData: HelperType = {
            text: t('home.inputSign'),
            boo: true
          };
          addressHelper[i] = helperData;
          return [...addressHelper];
        });
        return false;
      } else if (!util.validateAddress(value)) {
        setAddressHelper(() => {
          const helperData: HelperType = {
            text: t('home.addreeType'),
            boo: true
          };
          addressHelper[i] = helperData;
          return [...addressHelper];
        });
        return false;
      } else if (
        arrAddress.some((item, index) => {
          if (index !== i) {
            return item === value;
          }
        })
      ) {
        setAddressHelper(() => {
          const helperData: HelperType = {
            text: t('home.save'),
            boo: true
          };
          addressHelper[i] = helperData;
          return [...addressHelper];
        });
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        addressHelper[i] = helperData;
        return true;
      }
    },
    [addressHelper, arrAddress, t]
  );
  const handleChangeAddress = (value: string, i: number) => {
    setArrAddress(() => {
      arrAddress[i] = value;
      return [...arrAddress];
    });
    handleVerifyAddress(value, i);
  };
  const handleVerifyNum = useCallback(
    (value: string) => {
      const num = value ? parseInt(String(value), 10) : 0;
      if (!num) {
        const helperData: HelperType = {
          text: t('home.inputNum'),
          boo: true
        };
        setNumHelper(helperData);
        return false;
      } else if (num < 2) {
        const helperData: HelperType = {
          text: t('home.min'),
          boo: true
        };
        setNumHelper(helperData);
        return false;
      } else if (num > arrAddress.length) {
        const helperData: HelperType = {
          text: t('home.limit', { num: arrAddress.length }),
          boo: true
        };
        setNumHelper(helperData);
        return false;
      } else {
        const helperData: HelperType = {
          text: '',
          boo: false
        };
        setNumHelper(helperData);
        return true;
      }
    },
    [arrAddress.length, t]
  );
  const handleChangeNum = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    console.log(util.formatDecimalPlaces(value, 0));
    const num = util.formatDecimalPlaces(value, 0) ? util.formatDecimalPlaces(value, 0) : '';
    setNum(num);
    handleVerifyNum(num);
  };
  const handleSnackbarClose = () => {
    setIsOpen(false);
  };
  const handleAdd = () => {
    setIsOpen(false);
    if (arrAddress.length >= 15) {
      setIsOpen(true);
      setTip(t('home.limit', { num: 15 }));
    } else {
      setArrAddress(() => {
        arrAddress.push('');
        return [...arrAddress];
      });
    }
  };
  const handleDetele = (index: number) => {
    console.log('🚀 ~ file: CreateTeam.tsx:80 ~ handleDetele ~ index:', index);
    setArrAddress(() => {
      arrAddress.splice(index, 1);
      return [...arrAddress];
    });
  };
  const handleContinue = () => {
    console.log(addressHelper);
    const booName = handleVerifyName(name);
    console.log('🚀 ~ file: CreateTeam.tsx:152 ~ handleCreate ~ booName:', booName);
    const booNum = handleVerifyNum(String(num));
    console.log('🚀 ~ file: CreateTeam.tsx:174 ~ handleCreate ~ booNum:', booNum);
    const arrAddressBoo = arrAddress.map((item, i) => {
      return handleVerifyAddress(item, i);
    });
    console.log('🚀 ~ file: CreateTeam.tsx:178 ~ arrAddressBoo ~ arrAddressBoo:', arrAddressBoo);
    const booAddress = arrAddressBoo.every((item) => item === true);
    console.log('🚀 ~ file: CreateTeam.tsx:179 ~ handleCreate ~ booAddress:', booAddress);
    if (booAddress && booName && booNum) {
      setIsContinue(false);
    }
  };
  const handleClose = () => {
    setIsCheck(false);
  };
  const teamParams = useMemo(() => {
    const params: TeamParams = {
      jsonrpc: '2.0',
      method: 'ibax.getList',
      id: Date.now(),
      params: [
        {
          name: '@1wallets',
          where: `{'owners -> ${current.account}': 1}`,
          order: {
            id: 1
          },
          offset: 0,
          limit: 10
        }
      ]
    };
    return params;
  }, [current.account]);
  const handleConfirm = async () => {
    setIsCheck(false);
    const teamSeacrch = await dispatch(initTeamSearch(teamParams));
    if (initTeamSearch.fulfilled.match(teamSeacrch)) {
      const list = teamSeacrch.payload.list ? teamSeacrch.payload.list : [];
      if (list.length) {
        const teamFirst = teamSeacrch.payload.list[0];
        dispatch(teamSelectData(teamFirst));
        dispatch(
          teamUpdateOne({
            id: teamFirst.id,
            changes: { isSelect: true } as any
          })
        );
      }
    }
    navigate('/', { replace: true });
  };
  const handleLast = () => {
    setIsContinue(true);
  };
  const handleNewBuilt = () => {
    setIsCheck(true);
  };
  const handleCancel = () => {
    navigate('/', { replace: true });
  };
  return (
    <MainContainer>
      {isContinue ? (
        <Box>
          <Typography variant="h5" mb={2}>
            {t('home.setting')}
          </Typography>
          <Typography variant="body1" mb={3}>
            {t('home.des')}
          </Typography>
          <form autoComplete="off">
            <FormControl sx={{ width: { md: '60%', sm: '100%' }, display: 'block', mb: 3 }}>
              <Typography variant="body1" mb={2}>
                {t('home.team')}
              </Typography>
              <Typography variant="body2" mb={2}>
                {t('home.name')}
              </Typography>
              <OutlinedInput
                placeholder={t('home.inputName')}
                size="medium"
                fullWidth
                value={name}
                onChange={handleChangeName}
                error={nameHelper ? nameHelper.boo : false}
              />
              <FormHelperText error={true}>{nameHelper ? nameHelper.text : ''}</FormHelperText>
            </FormControl>
            {arrAddress.map((item: string, index: number) => {
              return (
                <FormControl sx={{ width: { md: '60%', sm: '100%' }, display: 'block', mb: 3 }} key={index} required>
                  <Typography variant="body1" mb={2}>
                    {t('home.sign', { num: index + 1 })}
                  </Typography>
                  {index === 0 ? (
                    <>
                      <OutlinedInput placeholder={t('home.inputSign')} size="medium" fullWidth value={item} disabled />
                      <FormHelperText error={true}></FormHelperText>
                    </>
                  ) : (
                    <>
                      <Stack direction="row">
                        <OutlinedInput
                          placeholder={t('home.inputSign')}
                          size="medium"
                          fullWidth
                          value={arrAddress[index] || ''}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const { value } = event.target;
                            handleChangeAddress(value, index);
                          }}
                          error={addressHelper[index] ? addressHelper[index].boo : false}
                        />
                        {index >= 3 ? (
                          <Button
                            variant="outlined"
                            sx={{ ml: 1, minWidth: 150 }}
                            onClick={() => {
                              handleDetele(index);
                            }}
                            size="large">
                            {t('home.delete')}
                          </Button>
                        ) : (
                          ''
                        )}
                      </Stack>
                      <FormHelperText error={true}>
                        {addressHelper[index] ? addressHelper[index].text : ''}
                      </FormHelperText>
                    </>
                  )}
                </FormControl>
              );
            })}
            <FormControl sx={{ width: { md: '60%', sm: '100%' }, display: 'block', mb: 3, mt: 4 }}>
              <Button
                variant="filled"
                startIcon={<Add />}
                onClick={handleAdd}
                sx={{ minWidth: 150, lineHeight: 2.4 }}
                size="large">
                {t('home.new')}
              </Button>
            </FormControl>
            <FormControl sx={{ width: { md: '60%', sm: '100%' }, display: 'block', mb: 1 }}>
              <Stack direction="row" spacing={3} mb={3}>
                <Typography variant="body1" mb={2}>
                  {t('home.num')}
                </Typography>
                <Tooltip title={t('home.signtip')} placement="bottom">
                  <HelpOutlineIcon fontSize="medium" sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </Stack>
              <OutlinedInput
                placeholder={t('home.inputNum')}
                size="medium"
                type="InputNumber"
                sx={{ width: 60 }}
                value={num}
                onChange={handleChangeNum}
                error={numHelper ? numHelper.boo : false}
              />
              <Typography component="span" variant="body2" ml={1}>
                {t('home.over', { num: arrAddress.length })}
              </Typography>
              <FormHelperText error={true}>{numHelper ? numHelper.text : ''}</FormHelperText>
            </FormControl>
            <FormControl sx={{ width: { md: '60%', sm: '100%' }, display: 'block', mb: 1, mt: 5, textAlign: 'center' }}>
              <Stack direction="row" justifyContent="space-around">
                <Button
                  sx={{ minWidth: 150, lineHeight: 2.4 }}
                  variant="outlined"
                  onClick={handleCancel}
                  color="primary"
                  size="large">
                  {t('login.cancel')}
                </Button>
                <Button
                  sx={{ minWidth: 150, lineHeight: 2.4 }}
                  variant="filled"
                  onClick={handleContinue}
                  color="primary"
                  size="large">
                  {t('home.continue')}
                </Button>
              </Stack>
            </FormControl>
          </form>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" mb={2}>
            {t('home.sure')}
          </Typography>
          <Typography variant="body1" mb={3}>
            {t('home.mistake')}
          </Typography>
          <Box display="flex" mb={2}>
            <Typography variant="body1">{t('home.team')}:</Typography>
            <Typography variant="body1" ml={0.5}>
              {name}
            </Typography>
          </Box>
          <Typography variant="body1" mb={1}>
            {t('home.mulAddress')}
          </Typography>
          <Box mb={2}>
            {arrAddress.map((item, index) => {
              return (
                <Typography variant="body1" mb={1} key={index}>
                  {item}
                </Typography>
              );
            })}
          </Box>
          <Typography variant="body1" mb={2}>
            {t('home.signAll', { num, length: arrAddress.length })}
          </Typography>
          <Box
            sx={{
              width: { md: '60%', sm: '100%' },
              display: 'flex',
              justifyContent: 'space-around',
              mb: 1,
              mt: 5,
              textAlign: 'center'
            }}>
            <Fab variant="extended" onClick={handleLast} color="primary">
              {t('login.previous')}
            </Fab>
            <Box>
              <Fab variant="extended" onClick={handleNewBuilt} color="primary" disabled={!isAmount}>
                {t('home.build')}
              </Fab>
              {isAmount ? (
                ''
              ) : (
                <Typography variant="body2" color={(theme) => theme.palette.error.light} mt={1}>
                  {t('home.noGas')}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}>
        <Alert onClose={handleSnackbarClose} severity="error" variant="filled" sx={{ width: '100%' }}>
          {tip}
        </Alert>
      </Snackbar>
      <PasswordBox
        isCheck={isCheck}
        params={{
          contractName: 'MultiSignCreateWallet',
          TeamName: name,
          Owners: arrAddress,
          Threshold: num
        }}
        close={handleClose}
        confirm={handleConfirm}></PasswordBox>
    </MainContainer>
  );
};
