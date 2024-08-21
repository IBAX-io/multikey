import { LoginType } from '@/dataType';
import { arrLang } from '@/lang/config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { langValue, localeData, valueData } from '@/store/lang';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import type { SxProps } from '@mui/material';
import { Avatar, Box, Grid, IconButton, MenuItem, Paper, Select, Stack, Tooltip, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateAccount from './conponents/CreateAccount';
import CreateSetting from './conponents/CreateSetting';
import ImportWallet from './conponents/ImportWallet';
import LoginAccount from './conponents/LoginAccount';
import { LoginContext } from './conponents/LoginContext';
const win = window;
const Login = () => {
  const dispatch = useAppDispatch();
  const locale = useAppSelector(langValue);
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [loginData, setLoginData] = useState<LoginType>({ name: '', password: '' });
  const paperStyle: SxProps = {
    p: 0,
    height: '100vh'
  };
  const handleChangeStep = (num: number) => {
    setStep(num);
  };
  const handleChangeLoginData = (data: LoginType) => {
    setLoginData(data);
  };
  const handleBack = () => {
    setStep(() => step - 1);
  };
  /*   const loginSign = useMemo(() => {
    if (step === 1) {
      return t('login.sign');
    } else if (step === 2) {
      return t('login.create');
    } else if (step === 3) {
      return t('login.load');
    } else if (step === 4) {
      return t('login.import');
    }
  }, [step, t]); */

  const handleLangChange = async (event: SelectChangeEvent) => {
    const value = event.target.value;
    await dispatch(valueData(value));
    await dispatch(localeData(value));
    localStorage.setItem('lang', value);
    i18n.changeLanguage(value);
    win.location.reload();
  };

  return (
    <Paper sx={paperStyle}>
      <Box height="100%" display="flex" justifyContent="center" alignItems="center">
        {/*    <Box flex={2} p={5} display={{ xs: 'none', md: 'block' }}>
          <Typography variant="h3">{t('home.multi')}</Typography>
        </Box> */}
        <Box width={{ xs: '100%', md: '70%', lg: '65%', xl: '60%' }}>
          <Box
            p={{ xs: 3, md: 4, lg: 5 }}
            borderRadius={10}
            sx={{ backgroundColor: (theme) => theme.palette.onBody.main }}>
            <Grid container spacing={1} alignItems="center" justifyContent="space-between" mb={2}>
              <Grid item>
                <img src="/avatar-2.png" alt="logo" width="50" />
              </Grid>
              <Grid>
                {step > 1 ? (
                  <IconButton color="inherit" sx={{ p: 0.5 }} onClick={handleBack}>
                    <Tooltip title={t('login.back')}>
                      <KeyboardBackspaceIcon />
                    </Tooltip>
                  </IconButton>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
            <Box
              minHeight={{ xs: '100%', md: '384px' }}
              maxHeight={{ xs: '100%', md: '60vh' }}
              sx={{ overflowY: 'auto', backgroundColor: (theme) => theme.palette.onBody.main, py: 5 }}>
              {step === 1 ? (
                <Stack width="100%" direction="row" justifyContent="space-between" flexWrap="wrap">
                  <Box width={{ sm: '100%', md: '50%' }}>
                    <Typography
                      variant="h3"
                      mb={2}
                      sx={{ fontSize: { xs: '20px', md: '24px', lg: '28px', xl: '30px' } }}>
                      {t('login.sign')}
                    </Typography>
                    <Typography variant="body2" mb={2}>
                      {t('login.continue')}
                    </Typography>
                  </Box>
                  <Box width={{ sm: '100%', md: '50%' }}>
                    <LoginAccount change={handleChangeStep}></LoginAccount>
                  </Box>
                </Stack>
              ) : step === 2 ? (
                <Stack width="100%" direction="row" justifyContent="space-between" flexWrap="wrap">
                  <Box width={{ sm: '100%', md: '50%' }}></Box>
                  <Box width={{ sm: '100%', md: '50%' }}>
                    <CreateAccount change={handleChangeStep} changeLogin={handleChangeLoginData}></CreateAccount>
                  </Box>
                </Stack>
              ) : step === 3 ? (
                <Stack width="100%" direction="row" justifyContent="space-between" flexWrap="wrap">
                  <Box width={{ sm: '100%', md: '30%' }}>
                    <Typography
                      variant="h3"
                      mb={2}
                      sx={{ fontSize: { xs: '20px', md: '24px', lg: '28px', xl: '30px' } }}></Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" height="80%">
                      <Box>
                        <Box display="flex" justifyContent="center" mb={{ xs: 1, md: 2, lg: 3 }}>
                          <Avatar
                            alt="My Avatar"
                            sx={{
                              width: { xs: 50, md: 50 },
                              height: { xs: 50, md: 50 },
                              fontSize: { xs: 12, md: 12 },
                              bgcolor: 'primary.main',
                              color: 'onPrimary.main'
                            }}></Avatar>
                        </Box>
                        <Box textAlign="center" display="flex" justifyContent="center" mb={2}>
                          <Typography variant="body1" mb={1} textAlign="center" ml={0.5}>
                            {loginData.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box width={{ sm: '100%', md: '70%' }}>
                    <LoginContext.Provider value={{ change: handleChangeStep, loginData }}>
                      <CreateSetting></CreateSetting>
                    </LoginContext.Provider>
                  </Box>
                </Stack>
              ) : step === 4 ? (
                <Stack width="100%" direction="row" justifyContent="space-between" flexWrap="wrap">
                  <Box width={{ sm: '100%', md: '100%' }}>
                    <LoginContext.Provider value={{ change: handleChangeStep, loginData }}>
                      <ImportWallet></ImportWallet>
                    </LoginContext.Provider>
                  </Box>
                </Stack>
              ) : (
                ''
              )}
            </Box>
          </Box>
          <Box>
            <Select
              sx={{
                '& fieldset': {
                  border: 'none'
                },
                '& .MuiInputBase-input.MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: (theme) => theme.palette.container.main
                },
                '& .MuiTypography-root': {
                  mr: 1
                }
              }}
              labelId="lang-simple-select-label"
              id="lang-simple-select"
              value={locale}
              onChange={handleLangChange}>
              {arrLang.map((item: { label: string; value: string; logo: string }) => {
                return (
                  <MenuItem key={item.value} value={item.value}>
                    <Avatar alt="Remy Sharp" src={item.logo} sx={{ width: 25, height: 25 }} />
                    <Typography ml={1}>{item.label}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default Login;
