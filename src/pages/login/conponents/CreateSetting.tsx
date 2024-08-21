import ethers from '@/plugins/ethers';
import keyring from '@/plugins/keyring';
import util from '@/plugins/util';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginContext } from './LoginContext';

const CreateSetting = () => {
  const { t } = useTranslation();
  const { change, loginData } = useContext(LoginContext);
  const handleLoading = () => {
    change(4);
  };
  const handleCreateNew = () => {
    const accountList = util.getCache('accountList');
    util.removeCache('current');
    const strWords = ethers.generateMnemonic();
    const { privateKey } = ethers.wallet(strWords);
    const publicKey = ethers.publicKey(privateKey) as string;
    const getKeyring = keyring.getKeyring();
    const keyId = getKeyring.publicToID(publicKey);
    const account = keyring.addressString(keyId);
    const obj = {
      id: util.uuid(),
      index: 0,
      name: loginData.name,
      mnemonic: strWords,
      password: loginData.password,
      privateKey,
      publicKey,
      account,
      isShow: true,
      isLogin: true
    };
    if (accountList) {
      accountList.push(obj);
      util.setCache('accountList', accountList);
    } else {
      util.setCache('accountList', [obj]);
    }
    change(1);
  };
  return (
    <Box width="100%">
      <Typography variant="h5" sx={{ fontSize: { xs: '16px', md: '20px' } }} mb={{ xs: 1, md: 2, lg: 3 }}>
        {t('login.setting')}
      </Typography>
      <Typography component="div" sx={{ fontSize: { xs: '12px', md: '16px' } }} mb={{ xs: 1, md: 5 }}>
        {t('login.safety')}
      </Typography>
      <Grid container direction="row" justifyContent="space-between">
        <Grid
          item
          border={1}
          p={{ xs: 1, md: 2 }}
          borderRadius={5}
          width={{ xs: '100%', md: '45%' }}
          display="flex"
          flexWrap="wrap"
          alignContent="space-between"
          mb={{ xs: 2, md: 0 }}>
          <Box mb={{ xs: 1, md: 2, lg: 3 }}>
            <Typography variant="body2" mb={1}>
              {t('login.wallet')}
            </Typography>
            <Typography variant="body2" fontSize={{ xs: 12, md: 14 }}>
              {t('login.base')}
            </Typography>
          </Box>
          <Box textAlign="center" width="100%">
            <Button
              variant="filled"
              sx={{ fontSize: { xs: 12, md: 14 }, minWidth: 150, lineHeight: 2.4 }}
              onClick={handleCreateNew}
              size="large">
              {t('login.new')}
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          p={{ xs: 1, md: 2 }}
          border={1}
          borderRadius={5}
          width={{ xs: '100%', md: '45%' }}
          display="flex"
          flexWrap="wrap"
          alignContent="space-between">
          <Box mb={{ xs: 1, md: 2, lg: 3 }}>
            <Typography variant="body2" mb={1}>
              {t('login.had')}
            </Typography>
            <Typography variant="body2" fontSize={{ xs: 12, md: 14 }}>
              {t('login.multi')}
            </Typography>
          </Box>
          <Box textAlign="center" width="100%">
            <Button
              variant="filled"
              sx={{ fontSize: { xs: 12, md: 14 }, minWidth: 150, lineHeight: 2.4 }}
              onClick={handleLoading}
              size="large">
              {t('login.loading')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateSetting;
