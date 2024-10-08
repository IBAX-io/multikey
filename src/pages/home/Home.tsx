import GasTip from '@/components/appBar/GasTip';
import MainContainer from '@/components/cantainer/MainContainer';
import SkeletonBox from '@/components/cantainer/SkeletonBox';
import {
  BalanceItem,
  BalanceList,
  BalanceParams,
  BalanceType,
  EcoItem,
  EcoLogoItem,
  EcoLogoList,
  EcoParams,
  EcoPriceItem,
  EcoPriceList,
  EcoType,
  EcoTypeList,
  EcomOpenItem,
  TeamItem
} from '@/dataType';
import keyring from '@/plugins/keyring';
import { handleEcoBalance, handleEcoList, handleEcosystemLogo, handleTokenPrice } from '@/plugins/request/api';
import util from '@/plugins/util';
import { useAppSelector } from '@/store/hooks';
import { getBalance } from '@/store/message';
import { getSelectTeam, selectTeamIds } from '@/store/team';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import ImageIcon from '@mui/icons-material/Image';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  Alert,
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import AddToken from './components/AddToken';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const balance: BalanceType | null = useAppSelector(getBalance);
  const isSmUp = useMediaQuery(theme.breakpoints.up('md'));
  console.log('🚀 ~ file: Home.tsx:43 ~ Home ~ isSmUp:', isSmUp);
  const isSxUp = useMediaQuery(theme.breakpoints.up('sm'));
  console.log('🚀 ~ file: Home.tsx:45 ~ Home ~ isSxUp:', isSxUp);
  const teamIds = useAppSelector(selectTeamIds);
  const current = util.getCache('current');
  console.log('🚀 ~ file: Home.tsx:43 ~ Home ~ current:', current);
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  console.log('🚀 ~ file: Home.tsx:56 ~ Home ~ teamSelect:', teamSelect);
  // util.removeCache(`${teamSelect.wallet}`);
  const addTokensLocal = util.getCache(teamSelect.wallet) || [];
  const [ecoList, setEcoList] = useState<EcoTypeList | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [keyId, setKeyId] = useState('');
  const [isBackup, setIsBackup] = useState(true);
  const [isGas, setIsGas] = useState(false);
  // const [ecoIds, setEcoIds] = useState<number[]>([]);
  const [allAssets, setAllAssets] = useState('');
  // const [assets, setAssets] = useState<(string | null)[]>([]);
  // const [page, setPage] = useState(1);
  // const [count, setCount] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  /*   const limit = useMemo(() => {
    return isSmUp ? 10 : 5;
  }, [isSmUp]); */
  const ecoParams = useMemo(() => {
    const params: EcoParams = {
      jsonrpc: '2.0',
      method: 'ibax.getKeyInfo',
      id: 1,
      params: [teamSelect.wallet]
    };
    return params;
  }, [teamSelect.wallet]);
  const handleEcoData = useCallback(async () => {
    try {
      if (teamSelect.wallet) {
        const res = await handleEcoList(ecoParams);
        console.log('🚀 ~ file: Home.tsx:28 ~ handleEcoData ~ res:', res);
        setKeyId(keyring.addressToID(teamSelect.wallet));
        if (res) {
          const balanceParams = [] as BalanceParams;
          const ids = res.ecosystems.map((item: EcoItem) => {
            balanceParams.push({
              jsonrpc: '2.0',
              method: 'ibax.getBalance',
              id: Number(item.ecosystem),
              params: [teamSelect.wallet, Number(item.ecosystem)]
            });
            return Number(item.ecosystem);
          });
          console.log(balanceParams);
          const balance = (await handleEcoBalance(balanceParams)) as BalanceList;
          const priceData = (await handleTokenPrice(`token_price`, { ecosystems: ids.join(',') })) as EcoPriceList;
          console.log('🚀 ~ file: Home.tsx:101 ~ handleEcoData ~ priceData:', priceData);
          const logpData = (await handleEcosystemLogo('ecosystem_logo', { ecosystems: ids.join(',') })) as EcoLogoList;
          console.log('🚀 ~ file: Home.tsx:104 ~ handleEcoData ~ logpData:', logpData);
          const arr = balance!.map((item: BalanceItem) => {
            const ecoInfo = res.ecosystems.find((ele: EcoItem) => Number(ele.ecosystem) === item.id);
            const priceInfo = priceData!.find((ele: EcoPriceItem) => Number(ele.ecosystem) === item.id);
            const logoInfo = logpData!.find((ele: EcoLogoItem) => Number(ele.ecosystem) === item.id);
            return {
              id: item.id,
              name: ecoInfo!.name,
              tokenSymbol: item.result.token_symbol,
              digits: item.result.digits,
              logoURI: logoInfo!.logoURI,
              amount: item.result.amount,
              totalAmount: item.result.total,
              assets: util.formatDecimalPlaces(
                util.times(util.formatUnits(item.result.amount, item.result.digits), priceInfo!.price_in_usd || 0),
                6
              ),
              price: priceInfo!.price_in_usd
            };
          });
          const arrReduce = util.handleReduce([...arr, ...addTokensLocal]);
          console.log('🚀 ~ file: Home.tsx:147 ~ handleEcoData ~ arrReduce:', arrReduce);
          setEcoList(() => {
            return [...arrReduce];
          });
          util.setCache(`${teamSelect.wallet}-all`, [...arrReduce]);
          const all = arr.reduce((val: any, item: EcoType) => {
            return util.fromPuls(val, Number(item.assets!));
          }, 0);
          setAllAssets(util.format(all));
        }
      }
    } catch (error) {
      setEcoList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ecoParams, teamSelect.wallet]);
  useEffect(() => {
    handleEcoData();
  }, [handleEcoData]);
  const handleRouterRecord = (item: EcoType) => {
    const routerParams: any = {
      ...item,
      keyId
    };
    const str = encodeURIComponent(JSON.stringify(routerParams));
    navigate({ pathname: '/record', search: `?${createSearchParams({ query: str })}` });
  };
  const handleOpenAdd = () => {
    setIsAdd(true);
  };
  const handleCloseDialog = () => {
    setIsAdd(false);
  };
  const handleEcoItem = async (item: EcomOpenItem) => {
    const boo = ecoList?.some((ele: EcoType) => Number(ele.id) === Number(item.ecosystem));
    if (!boo) {
      const logpData = (await handleEcosystemLogo('ecosystem_logo', { ecosystems: `${item.info.id}` })) as EcoLogoList;
      const obj = {
        id: item.info.id,
        name: item.info.token_name,
        tokenSymbol: item.info.token_symbol,
        digits: item.info.digits,
        logoURI: logpData[0].logoURI,
        amount: '0',
        totalAmount: '0',
        assets: '0',
        price: '0'
      };
      addTokensLocal.push(obj);
      util.setCache(teamSelect.wallet, addTokensLocal);
      ecoList?.push(obj);
      util.setCache(`${teamSelect.wallet}-all`, ecoList);
      setEcoList(() => {
        return [...ecoList!];
      });
      setIsAdd(false);
    } else {
      setIsOpen(true);
    }
    return false;
  };
  const handleBalance = useCallback(async () => {
    if (balance) {
      const num = util.formatUnits(balance.amount, balance.digits);
      console.log('🚀 ~ file: CreateTeam.tsx:61 ~ handleBalanceParams ~ num:', num);
      console.log(util.greaterThanZero(0.1, num));
      const tip = util.getCache(current.account);
      if (!tip) {
        setIsGas(util.greaterThanZero(0.1, num));
      }
    }
  }, [balance, current.account]);
  useEffect(() => {
    handleBalance();
  }, [handleBalance]);
  const handleBarClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    if (current) {
      if (current.mnemonic) {
        // util.removeCache('backup');
        const backup = util.getCache(`${current.mnemonic}`);
        console.log('🚀 ~ file: Home.tsx:193 ~ useEffect ~ backup:', backup);
        if (backup === current.mnemonic) {
          setIsBackup(false);
        }
      } else {
        setIsBackup(false);
      }
    }
  }, [current]);
  const handleManage = () => {
    navigate('/manage');
  };
  const handleGasTip = () => {
    setIsGas(false);
    if (current) {
      util.setCache(current.account, 'tip');
    }
  };
  return (
    <MainContainer>
      {teamIds.length ? (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                width: { xs: '100%', sm: '100%', md: 'auto' },
                justifyContent: { xs: 'center', sm: 'center', md: 'left' },
                mb: { xs: 2, sm: 2, md: 0 }
              }}>
              {ecoList && ecoList.length ? (
                <>
                  <Typography variant="h6">{t('home.assets')}:</Typography>
                  <Typography mx={1} variant="h6">
                    {allAssets || 0} $
                  </Typography>
                </>
              ) : (
                <SkeletonBox num={1}></SkeletonBox>
              )}
            </Stack>
            <Stack
              direction="row"
              sx={{
                width: { xs: '100%', sm: '100%', md: 'auto' },
                justifyContent: { xs: 'space-around', sm: 'space-around', md: 'right' }
              }}>
              {ecoList && ecoList.length ? (
                <>
                  <Button
                    sx={{ minWidth: 150, lineHeight: 2.4, height: 52 }}
                    color="primary"
                    to={`/receive/${ecoList[0].tokenSymbol}/${ecoList[0].id}/${keyId}`}
                    component={Link}
                    variant="filled"
                    startIcon={<ReceiptIcon />}>
                    {t('home.receive')}
                  </Button>
                  <Button
                    sx={{ mx: 2, minWidth: 150, lineHeight: 2.4, height: 52 }}
                    color="primary"
                    to={`/transfer/${ecoList[0].tokenSymbol}/${ecoList[0].id}/${keyId}`}
                    component={Link}
                    variant="filled"
                    startIcon={<PaidIcon />}>
                    {t('home.transfer')}
                  </Button>
                  <Button
                    sx={{ minWidth: 150, lineHeight: 2.4, height: 52 }}
                    color="primary"
                    to="/create"
                    component={Link}
                    variant="filled"
                    startIcon={<AccountBalanceWalletOutlinedIcon />}>
                    {t('home.newBuilt')}
                  </Button>
                </>
              ) : (
                <SkeletonBox num={1}></SkeletonBox>
              )}
            </Stack>
          </Stack>
          <Box>
            {ecoList ? (
              ecoList.length ? (
                <>
                  <Box minHeight="50vh" maxHeight="60vh" sx={{ overflowY: 'auto', mb: 2 }}>
                    <List
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        mb: { xs: 2, md: 3, lg: 5 }
                      }}>
                      {ecoList.map((item: EcoType) => {
                        return (
                          <ListItem
                            key={item.id}
                            sx={{
                              width: { sm: '100%', md: '48%' },
                              px: 3,
                              py: 2,
                              backgroundColor: (theme) => theme.palette.onBody.main,
                              borderRadius: 5,
                              mb: 2,
                              cursor: 'pointer',
                              justifyContent: 'space-between'
                            }}
                            onClick={() => {
                              handleRouterRecord(item);
                            }}>
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
                            <ListItemText
                              sx={{ flexGrow: 0 }}
                              primary={`$ ${item.assets}`}
                              secondary={
                                <Fragment>
                                  <Typography component="span" variant="body1">
                                    {util.formatFixed(item.amount, item.digits)}
                                  </Typography>
                                  <Typography component="span" variant="body1" ml={0.5}>
                                    {item.tokenSymbol}
                                  </Typography>
                                </Fragment>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                  <Stack direction="row" justifyContent="center">
                    <Button
                      sx={{ fontSize: '16px', minWidth: 150, lineHeight: 2.4 }}
                      color="primary"
                      variant="filled"
                      size="large"
                      onClick={handleOpenAdd}>
                      {t('home.add')}
                    </Button>
                  </Stack>
                </>
              ) : (
                <Typography variant="body1">{t('login.no')}</Typography>
              )
            ) : (
              <SkeletonBox num={3}></SkeletonBox>
            )}
          </Box>
        </>
      ) : (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                width: { xs: '100%', sm: '100%', md: '50%' },
                justifyContent: { xs: 'center', sm: 'center', md: 'left' },
                mb: { xs: 2, sm: 2, md: 0 }
              }}>
              <Typography variant="h6">{t('home.assets')}:</Typography>
              <Typography ml={1} variant="h6">
                0 $
              </Typography>
            </Stack>
            <Box ml="auto">
              <Button
                color="primary"
                variant="filled"
                disabled
                sx={{ ml: 5, minWidth: 150, lineHeight: 2.4, height: 52 }}
                startIcon={<ReceiptIcon />}>
                {t('home.receive')}
              </Button>
              <Button
                color="primary"
                variant="filled"
                disabled
                sx={{ ml: 5, minWidth: 150, lineHeight: 2.4, height: 52 }}
                startIcon={<PaidIcon />}>
                {t('home.transfer')}
              </Button>
            </Box>
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Button
              to="/create"
              component={Link}
              sx={{ m: '15%', fontSize: '16px', minWidth: 150, lineHeight: 2.4, height: 52 }}
              color="primary"
              variant="filled"
              size="large">
              {t('home.create')}
            </Button>
          </Stack>
        </Box>
      )}
      {isBackup ? (
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button
            startIcon={<FmdBadIcon fontSize="small" />}
            onClick={handleManage}
            sx={{ fontSize: '12px', color: theme.palette.warning.main, my: 5 }}
            color="warning"
            size="large">
            {t('nav.backup')}
          </Button>
        </Stack>
      ) : (
        ''
      )}
      {/* <Typography textAlign="center" color={theme.palette.warning.main} fontWeight="bolder" my={5}>
        {t('nav.backup')}
      </Typography> */}
      <AddToken isAdd={isAdd} closeDialog={handleCloseDialog} ecoItem={handleEcoItem}></AddToken>
      <Snackbar
        open={isOpen}
        autoHideDuration={2000}
        onClose={handleBarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleBarClose} severity="warning" variant="filled" sx={{ width: '100%' }}>
          {t('user.tokensave')}
        </Alert>
      </Snackbar>
      <GasTip isGas={isGas} close={handleGasTip}></GasTip>
    </MainContainer>
  );
};

export default Home;
