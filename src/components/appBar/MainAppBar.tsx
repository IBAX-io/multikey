import { AccountItem, AccountList, BalanceParams, BalanceType, LoginData, TeamParams, UidData } from '@/dataType';
import keyring from '@/plugins/keyring';
import { handleGetuid, handlePostLogin } from '@/plugins/request/api';
import util from '@/plugins/util';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getBalance, initBalance } from '@/store/message';
import { initTeamSearch, resetTeamSelect, selectTeamIds, teamSelectData, teamUpdateOne } from '@/store/team';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MenuIcon from '@mui/icons-material/MenuTwoTone';
import {
  Alert,
  AppBar,
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@mui/material';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChangeLanguage from './ChangeLanguage';
import ChangeTheme from './ChangeTheme';
import MessageCenter from './MessageCenter';
import TeamName from './TeamName';
// import DeleteIcon from '@mui/icons-material/Delete';
interface HeaderProps {
  onDrawerToggle?: () => void;
  window?: () => Window;
}
const win = window;
const MainAppBar: FC<HeaderProps> = ({ onDrawerToggle, window }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const balance: BalanceType | null = useAppSelector(getBalance);
  const [avatarEl, setAvatarEl] = useState<null | HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  // const current = util.getCache('current');
  console.log(util.getCache('current'));
  const [loading, setLoading] = useState(false);
  const [accountList, setAccountList] = useState<AccountList | null>(null);
  const [current, setCurrent] = useState<AccountItem | null>(util.getCache('current'));
  const openAvatar = Boolean(avatarEl);
  const currNetwork = util.currNetwork();
  const closeMenu = () => {
    setAvatarEl(null);
  };
  const handleAvatarMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (current && current.mnemonic) {
      const list = util.getCache(`${current!.mnemonic}-${current!.selectId}`);
      setAccountList(list);
      console.log('🚀 ~ file: MainAppBar.tsx:52 ~ handleAvatarMenu ~ list:', list);
    } else {
      setAccountList(() => {
        return [current!];
      });
    }
    setAvatarEl(event.currentTarget);
  };
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });
  const teamIds = useAppSelector(selectTeamIds);
  const teamParams = useMemo(() => {
    if (current) {
      const params: TeamParams = {
        jsonrpc: '2.0',
        method: 'ibax.getList',
        id: Date.now(),
        params: [
          {
            name: '@1multi_sign_wallets',
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
    }
  }, [current]);
  const handleAsyncThunk = useCallback(async () => {
    if (teamParams) {
      const teamSeacrch = await dispatch(initTeamSearch(teamParams));
      if (initTeamSearch.fulfilled.match(teamSeacrch)) {
        const list = teamSeacrch.payload.list ? teamSeacrch.payload.list : [];
        if (list.length) {
          const teamSelect = util.getCache('teamSelect');
          console.log('🚀 ~ file: MainAppBar.tsx:94 ~ handleAsyncThunk ~ teamSelect:', teamSelect);
          const teamFirst = teamSeacrch.payload.list[0];
          if (teamSelect) {
            dispatch(teamSelectData(teamSelect));
            dispatch(
              teamUpdateOne({
                id: teamSelect.id,
                changes: { isSelect: true } as any
              })
            );
          } else {
            dispatch(teamSelectData(teamFirst));
            dispatch(
              teamUpdateOne({
                id: teamFirst.id,
                changes: { isSelect: true } as any
              })
            );
          }
        }
      }
    }
  }, [dispatch, teamParams]);
  useEffect(() => {
    handleAsyncThunk();
    dispatch(resetTeamSelect());
  }, [dispatch, handleAsyncThunk]);
  const balanceParams = useMemo(() => {
    if (current && current.account) {
      const params: BalanceParams = [
        {
          jsonrpc: '2.0',
          method: 'ibax.getBalance',
          id: 1,
          params: [current.account, 1]
        }
      ];
      return params;
    }
  }, [current]);
  const handleGetBalance = useCallback(async () => {
    if (balanceParams) {
      await dispatch(initBalance(balanceParams));
    }
  }, [balanceParams, dispatch]);
  useEffect(() => {
    handleGetBalance();
  }, [dispatch, handleGetBalance]);
  const handleBarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
  };
  const handleNavigator = (account: string) => {
    if (account) {
      util.copyToClipboard(account!);
      setIsOpen(true);
    }
  };
  const handleClose = () => {};
  const handleChangeAccount = async (item: AccountItem) => {
    console.log('🚀 ~ file: MainAppBar.tsx:139 ~ handleChangeAccount ~ item:', item);
    setLoading(true);
    const res = (await handleGetuid()) as UidData;
    const networkId = res.network_id;
    const { uid, hasher, token } = res;
    const getKeyring = keyring.getKeyring(hasher);
    const { privateKey } = item!;
    const publicKey = getKeyring.generatePublicKey(privateKey);
    console.log(publicKey === item!.publicKey);
    const nodeSign = getKeyring.sign(`LOGIN${parseInt(networkId, 10)}${uid}`, privateKey);
    console.log(nodeSign);
    const params = {
      data: {
        signature: nodeSign,
        pubkey: publicKey,
        ecosystem: 1
      },
      token
    };
    const loginData = (await handlePostLogin(params)) as LoginData;
    console.log('🚀 ~ file: LoginAccount.tsx:85 ~ handleSubmit ~ loginData:', loginData);
    const { account } = loginData!;
    const loginAccount: AccountItem = {
      ...item!,
      publicKey,
      networkId: Number(networkId),
      account: account,
      keyId: loginData.key_id,
      isLogin: true
    };
    util.setCache('current', loginAccount);
    util.setCache('hasher', hasher);
    util.setCacheToken('token', loginData.token);
    setLoading(false);
    setCurrent(loginAccount);
    const arr = accountList!.map((ele: AccountItem) => {
      if (ele.id === item.id) {
        ele.isLogin = true;
      } else {
        ele.isLogin = false;
      }
      return ele;
    });
    util.setCache(`${item?.mnemonic}-${item.selectId}`, arr);
    win.location.href = '/';
  };
  /*  const handleDeteleAccount = (item: AccountItem) => {
    console.log('🚀 ~ file: MainAppBar.tsx:191 ~ handleDeteleAccount ~ item:', item);
  }; */
  const handleExit = () => {
    util.removeCacheToken('token');
    util.removeCache('teamSelect');
    util.removeCacheToken('type');
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
  useEffect(() => {
    document.addEventListener('jutkeyEvent', async ({ detail }: any) => {
      console.log('🚀 ~ file: HelloWorld.vue:64 ~ window.addEventListener ~ detail:', detail);
      const type = util.getCacheToken('type');
      console.log('🚀 ~ file: MainAppBar.tsx:241 ~ document.addEventListener ~ type:', type);
      if (type === 'jutkey_connect') {
        if (detail.type === 'jutkey_connect') {
          const { current } = detail;
          current.isShow = true;
          current.isLogin = true;
          current.id = util.uuid();
          util.setCache('current', current);
          util.setCacheToken('token', current.token);
          util.setCacheToken('type', detail.type);
          util.removeCache('teamSelect');
          location.href = '/';
        }
        if (detail.type === 'jutkey_break') {
          util.removeCache('teamSelect');
          util.removeCache('current');
          util.removeCacheToken('token');
          util.removeCacheToken('type');
          location.href = '/login';
        }
      }
    });
  });
  return (
    <>
      <AppBar position="sticky" elevation={trigger ? 2 : 0}>
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item sx={{ display: { md: 'none', sm: 'block' }, mx: 1 }}>
              <IconButton color="inherit" edge="start" onClick={onDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item sx={{ ml: { xs: 'auto', sm: 'auto', md: 0 } }}>
              {teamIds.length ? <TeamName close={handleClose}></TeamName> : ''}
            </Grid>
            <Grid container alignItems="center" width="auto">
              <Grid item sx={{ ml: { xs: 0, sm: 0 } }}>
                <MessageCenter></MessageCenter>
              </Grid>
              <Grid item sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                <ChangeTheme></ChangeTheme>
              </Grid>
              <Grid item sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                <ChangeLanguage></ChangeLanguage>
              </Grid>
              <Grid item>
                {/*  <Tooltip title="@ZakAlbert94"> */}
                <IconButton color="inherit" sx={{ p: 0.5 }} onClick={handleAvatarMenu}>
                  {current ? (
                    <Avatar
                      alt="My Avatar"
                      sx={{
                        width: 30,
                        height: 30,
                        fontSize: 14,
                        bgcolor: 'primary.main',
                        color: 'onPrimary.main'
                      }}
                      src={`${currNetwork.rpc}/api/v2//avatar/1/${current.account}`}>
                      <Avatar src="/profile.png" />
                    </Avatar>
                  ) : (
                    <Avatar src="/profile.png" />
                  )}
                </IconButton>
              </Grid>
              <Grid item mx={2}>
                {current ? (
                  <Stack direction="row" alignItems="center">
                    <Typography variant="body2" component="span">
                      {current.account}
                    </Typography>
                    <IconButton
                      color="primary"
                      aria-label="ContentCopyIcon"
                      onClick={(event: { preventDefault: () => void; stopPropagation: () => void }) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleNavigator(current.account!);
                      }}
                      size="medium">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                ) : (
                  ''
                )}
                {balance ? (
                  <Stack direction="row" alignItems="center">
                    <Typography variant="body2" component="span">
                      {util.formatFixed(balance.amount, balance.digits)}
                    </Typography>
                    <Typography variant="body2" component="span" ml={1}>
                      {balance.token_symbol}
                    </Typography>
                  </Stack>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Grid>
          <Menu
            id="avatar-menu"
            anchorEl={avatarEl}
            open={openAvatar}
            onClose={closeMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
            sx={{
              overflowY: 'auto',
              maxHeight: '350px',
              '& .MuiList-root': {
                my: 2
              }
            }}>
            {accountList
              ? accountList.map((item: AccountItem) => {
                  return (
                    <>
                      {item.isShow ? (
                        <MenuItem key={item.id}>
                          <Box mr={1} width={25}>
                            {item.isLogin ? <CheckIcon color="success" fontSize="medium"></CheckIcon> : ''}
                          </Box>
                          <Box
                            onClick={() => {
                              handleChangeAccount(item);
                            }}>
                            <Stack direction="row" alignItems="center">
                              <Typography variant="body2" mr={1}>
                                {t('login.accountName')}:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  width: '150px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                {item.name}
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center">
                              <Typography variant="body2" mr={1}>
                                {t('login.address')}:
                              </Typography>
                              <Typography variant="body2">{item.account}</Typography>
                              <IconButton
                                color="primary"
                                aria-label="ContentCopyIcon"
                                onClick={(event: { preventDefault: () => void; stopPropagation: () => void }) => {
                                  //
                                  event.preventDefault();
                                  event.stopPropagation();
                                  handleNavigator(item.account!);
                                }}
                                size="medium">
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Box>
                          {/*   <Box ml={1} width={25}>

                                {!item.isLogin ? (
                                  <DeleteIcon
                                    color="info"
                                    fontSize="medium"
                                    onClick={() => {
                                      handleDeteleAccount(item);
                                    }}></DeleteIcon>
                                ) : (
                                  ''
                                )}
                              </Box> */}
                        </MenuItem>
                      ) : (
                        ''
                      )}
                    </>
                  );
                })
              : '000'}
            <MenuItem sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button variant="filled" sx={{ minWidth: 150, lineHeight: 2.4 }} onClick={handleExit} size="large">
                {t('nav.exit')}
              </Button>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Snackbar
        open={isOpen}
        autoHideDuration={2000}
        onClose={handleBarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleBarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {t('login.cody')}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default memo(MainAppBar);
