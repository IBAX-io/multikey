import SkeletonBox from '@/components/cantainer/SkeletonBox';
import { EcoLogoItem, EcoLogoList, EcomOpenItem, EcomOpenList, EcoOpenParams } from '@/dataType';
import { handleEcosystemLogo, handleOpenEcosystem } from '@/plugins/request/api';
import util from '@/plugins/util';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  styled,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Fragment, memo, UIEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
      width: '100%',
      minHeight: isSmUp ? '60vh' : '40vh',
      maxHeight: isSmUp ? '60vh' : '40vh'
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(2)
    }
  };
});

const AddToken = ({
  isAdd,
  closeDialog,
  ecoItem
}: {
  isAdd: boolean;
  closeDialog: () => void;
  ecoItem: (_item: EcomOpenItem) => void;
}) => {
  const { t } = useTranslation();
  const [ecoList, setEcoList] = useState<EcomOpenList | null>(null);
  const pageRef = useRef(1);
  const [scrollLoad, setScrollLoad] = useState(false);
  const [isMore, setIsmore] = useState(false);
  const limit = 10;
  const ecoParams = useMemo(() => {
    const params: EcoOpenParams = {
      jsonrpc: '2.0',
      method: 'ibax.getOpenEcosystem',
      id: 1,
      params: [2, 0, 10]
    };
    return params;
  }, []);
  const handleEcoData = useCallback(async () => {
    ecoParams.params = [2, 0, 10];
    const res = await handleOpenEcosystem(ecoParams);
    console.log('🚀 ~ file: Home.tsx:28 ~ handleEcoData ~ res:', res);
    const ids = res?.list.map((item: EcomOpenItem) => {
      return item.ecosystem;
    });
    const logpData = (await handleEcosystemLogo('ecosystem_logo', { ecosystems: ids!.join(',') })) as EcoLogoList;
    const data = res?.list.map((item: EcomOpenItem) => {
      const logoInfo = logpData!.find((ele: EcoLogoItem) => Number(ele.ecosystem) === item.ecosystem);
      item.info.logoURL = logoInfo?.logoURI;
      return item;
    });
    setEcoList(() => {
      return {
        count: res!.count!,
        list: [...data!]
      };
    });
  }, [ecoParams]);
  useEffect(() => {
    if (isAdd) {
      handleEcoData();
    }
  }, [handleEcoData, isAdd]);
  const handleTokenClose = () => {
    handleEcoData();
    closeDialog();
  };
  const handleListScroll = async (event: UIEvent<HTMLUListElement>) => {
    if (scrollLoad) {
      return;
    }
    const { target } = event;
    const dom: HTMLElement = target as HTMLElement;
    const { scrollHeight, scrollTop, offsetHeight } = dom;
    if (scrollTop + offsetHeight >= scrollHeight - 25) {
      const num = Math.ceil(ecoList!.count / limit);
      if (num > pageRef.current && !scrollLoad) {
        setScrollLoad(true);
        pageRef.current += 1;
        ecoParams.params[1] = (pageRef.current - 1) * limit;
        setTimeout(async () => {
          const res = await handleOpenEcosystem(ecoParams);
          const ids = res?.list.map((item: EcomOpenItem) => {
            return item.ecosystem;
          });
          const logpData = (await handleEcosystemLogo('ecosystem_logo', { ecosystems: ids!.join(',') })) as EcoLogoList;
          const num = Math.ceil(ecoList!.count / limit);
          console.log('🚀 ~ file: Record.tsx:148 ~ setTimeout ~ num:', num);
          if (num > pageRef.current) {
            setIsmore(true);
          } else {
            setIsmore(false);
          }
          const data = res?.list.map((item: EcomOpenItem) => {
            const logoInfo = logpData!.find((ele: EcoLogoItem) => Number(ele.ecosystem) === item.ecosystem);
            item.info.logoURL = logoInfo?.logoURI;
            return item;
          });
          setEcoList(() => {
            return {
              count: res!.count,
              list: [...ecoList!.list, ...data!]
            };
          });
          setScrollLoad(false);
        }, 500);
      }
    }
  };
  const handleSelectToken = async (item: EcomOpenItem) => {
    ecoItem(item);
  };
  return (
    <BootstrapDialog fullWidth={true} onClose={handleTokenClose} aria-labelledby="customized-dialog-title" open={isAdd}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <DialogTitle sx={{ m: 0, p: 2 }} id="jutkey-customized-dialog-title">
          {t('home.add')}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleTokenClose}
          /*    sx={{
          position: 'absolute',
          right: 8,
          left: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500]
        }} */
        >
          <CloseIcon />
        </IconButton>
      </Stack>

      <DialogContent dividers sx={{ height: '50vh' }}>
        <List component="ul" sx={{ height: '45vh', overflowY: 'auto' }} onScroll={handleListScroll}>
          {ecoList ? (
            ecoList.list.length ? (
              ecoList.list.map((item: EcomOpenItem) => {
                return (
                  <ListItemButton
                    key={item.ecosystem}
                    onClick={() => {
                      handleSelectToken(item);
                    }}>
                    <ListItemAvatar>
                      {item.info.logoURL ? (
                        <Avatar src={item.info.logoURL} sx={{ width: 30, height: 30 }}>
                          <ImageIcon />
                        </Avatar>
                      ) : (
                        <Avatar sx={{ width: 30, height: 30 }}>
                          <ImageIcon />
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Fragment>
                          <Typography
                            component="div"
                            variant="body2"
                            mb={1}
                            sx={{
                              width: '70%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>{`${item.info.name} # ${item.info.id}`}</Typography>
                        </Fragment>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">
                        {util.formatFixed(item.info.total_amount, item.info.digits)}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {item.info.token_symbol}
                      </Typography>
                      {/*   <Typography variant="body2" sx={{ ml: 1, width: '30px' }}>
                  {item.isSelect && <CheckIcon fontSize="medium" color="success"></CheckIcon>}
                </Typography> */}
                    </Box>
                  </ListItemButton>
                );
              })
            ) : (
              <Stack direction="row" justifyContent="center" alignItems="center" height="100%">
                <Typography>{t('login.no')}</Typography>
              </Stack>
            )
          ) : (
            <SkeletonBox num={3}></SkeletonBox>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 3
            }}>
            {scrollLoad ? (
              <>
                <CircularProgress size={20} />
                <Typography variant="body2" ml={2}>
                  {t('nav.load')}
                </Typography>
              </>
            ) : isMore ? (
              <>
                <Typography variant="body2" ml={2}>
                  {t('nav.drop')}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" ml={2}>
                  {t('nav.nomore')}
                </Typography>
              </>
            )}
          </Box>
        </List>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default memo(AddToken);
