import MainContainer from '@/components/cantainer/MainContainer';
import SkeletonBox from '@/components/cantainer/SkeletonBox';
import { RecordItem, RecordList, RecordParams, TeamItem } from '@/dataType';
import { handleSecond, handleSecondUTC } from '@/plugins/day';
import keyring from '@/plugins/keyring';
import { handleRecordRequests } from '@/plugins/request/api';
import util from '@/plugins/util';
import { useAppSelector } from '@/store/hooks';
import { getSelectTeam } from '@/store/team';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ImageIcon from '@mui/icons-material/Image';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { UIEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export const Component = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const { id, keyId, amount, digits, logoURI, tokenSymbol, assets } = JSON.parse(decodeURIComponent(query!));
  const navigate = useNavigate();
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const getKeyId = keyring.addressToID(teamSelect.wallet);
  const [recordList, setRecordList] = useState<RecordList | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const pageRef = useRef(1);
  const [scrollLoad, setScrollLoad] = useState(false);
  const [isMore, setIsmore] = useState(false);
  const limit = 10;
  const recordParams = useMemo(() => {
    const params: RecordParams = {
      jsonrpc: '2.0',
      method: 'ibax.getList',
      id: Date.now(),
      params: [
        {
          name: '@1history',
          where: `{ $or: [{ sender_id: ${keyId} }, { recipient_id: ${keyId} }], ecosystem: ${Number(id)} }`,
          order: {
            id: -1
          },
          offset: 0,
          limit
        }
      ]
    };
    return params;
  }, [id, keyId]);
  const [rowsPerPage, setRowsPerPage] = useState(recordParams.params[0].limit);
  const handlGetRecord = useCallback(async () => {
    if (Number(keyId)) {
      const res = await handleRecordRequests(recordParams);
      console.log('🚀 ~ file: Record.tsx:43 ~ handlGetRecord ~ res:', res);
      if (res) {
        setRecordList(res);
      }
    }
  }, [keyId, recordParams]);

  useEffect(() => {
    handlGetRecord();
  }, [id, keyId, getKeyId, navigate, handlGetRecord, tokenSymbol, digits]);
  const handleChangePage = async (_event: unknown, newPage: number) => {
    recordParams.params[0].offset = newPage * limit;
    setPage(newPage);
    const data = await handleRecordRequests(recordParams);
    setRecordList(data);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleListScroll = async (event: UIEvent<HTMLUListElement>) => {
    if (scrollLoad) {
      return;
    }
    const { target } = event;
    const dom: HTMLElement = target as HTMLElement;
    const { scrollHeight, scrollTop, offsetHeight } = dom;
    if (scrollTop + offsetHeight >= scrollHeight - 25) {
      const num = Math.ceil(recordList!.count / limit);
      if (num > pageRef.current && !scrollLoad) {
        setScrollLoad(true);
        pageRef.current += 1;
        recordParams.params[0].offset = (pageRef.current - 1) * limit;
        setTimeout(async () => {
          const data = await handleRecordRequests(recordParams);
          console.log('🚀 ~ file: Record.tsx:146 ~ setTimeout ~ data:', data);
          const num = Math.ceil(recordList!.count / limit);
          console.log('🚀 ~ file: Record.tsx:148 ~ setTimeout ~ num:', num);
          if (num > pageRef.current) {
            setIsmore(true);
          } else {
            setIsmore(false);
          }
          setRecordList(() => {
            return {
              count: data!.count,
              list: [...recordList!.list, ...data!.list]
            };
          });
          setScrollLoad(false);
        }, 500);
      }
    }
  };
  return (
    <MainContainer>
      <Typography variant="h5" mb={2}>
        {t('home.details')}
      </Typography>

      <>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={2}
          pb={2}
          mb={2}
          borderColor={(theme) => theme.palette.surfaceVariant.main}>
          <Stack direction="row" alignItems="center" flex={1} justifyContent="space-between">
            <Stack direction="row" alignItems="center">
              {Number(id) === 1 ? (
                <Avatar src="/logo-big.png" sx={{ width: 30, height: 30 }}>
                  <ImageIcon />
                </Avatar>
              ) : (
                <>
                  {logoURI ? (
                    <Avatar src={logoURI} sx={{ width: 30, height: 30 }}></Avatar>
                  ) : (
                    <Avatar sx={{ width: 30, height: 30 }}>
                      <ImageIcon fontSize="medium" />
                    </Avatar>
                  )}
                </>
              )}
              <Typography variant="body1" ml={2}>
                {tokenSymbol}
              </Typography>
            </Stack>
            <Box>
              <Typography ml={1} component="div">
                $ {assets}
              </Typography>
              <Typography ml={1} component="div">
                {util.formatFixed(amount!, Number(digits!))}
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction="row"
            spacing={3}
            flex={1}
            justifyContent="flex-end"
            sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
            <Button
              sx={{ minWidth: 120, lineHeight: 2.4, height: 52 }}
              variant="filled"
              to={`/receive/${tokenSymbol}/${id}/${keyId}`}
              component={Link}
              size="large">
              {t('home.receive')}
            </Button>
            <Button
              sx={{ minWidth: 120, lineHeight: 2.4, height: 52 }}
              variant="filled"
              to={`/transfer/${tokenSymbol}/${id}/${keyId}`}
              component={Link}
              size="large">
              {t('home.transfer')}
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          mb={3}
          spacing={3}
          justifyContent="space-around"
          sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' } }}>
          <Button
            sx={{ minWidth: 120, lineHeight: 2.4 }}
            variant="filled"
            to={`/receive/${tokenSymbol}/${id}/${keyId}`}
            component={Link}
            size="large">
            {t('home.receive')}
          </Button>
          <Button
            sx={{ minWidth: 120, lineHeight: 2.4 }}
            variant="filled"
            to={`/transfer/${tokenSymbol}/${id}/${keyId}`}
            component={Link}
            size="large">
            {t('home.transfer')}
          </Button>
        </Stack>
      </>
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
        {recordList ? (
          <>
            <TableContainer sx={{ minHeight: 440 }}>
              <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell width={150} align="left">
                      {t('home.block')}
                    </TableCell>
                    <TableCell align="center">{t('home.hash')}</TableCell>
                    <TableCell align="center">{t('home.address')}</TableCell>
                    <TableCell align="center">{t('home.date')}</TableCell>
                    <TableCell align="center">{t('home.type')}</TableCell>
                    <TableCell align="center">{t('home.amount')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recordList.list ? (
                    recordList.list.map((item: RecordItem) => {
                      return (
                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={item.id}>
                          <TableCell align="left">{item.block_id}</TableCell>
                          <TableCell align="center" sx={{ maxWidth: 150 }}>
                            <Tooltip title={item.txhash} placement="bottom">
                              <Typography
                                variant="body2"
                                sx={{
                                  display: 'block',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  cursor: 'pointer'
                                }}>
                                {item.txhash}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            {getKeyId === item.sender_id
                              ? keyring.addressString(item.recipient_id)
                              : keyring.addressString(item.sender_id)}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title={handleSecondUTC(item.created_at)} placement="bottom">
                              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                                {handleSecond(item.created_at)}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">{t(util.eventType(Number(item.type)))}</TableCell>
                          <TableCell align="center">
                            {getKeyId === item.sender_id ? (
                              <Typography
                                variant="body2"
                                component="span"
                                color={(theme) => theme.palette.success.light}>
                                - {util.formatFixed(item.amount, Number(digits!))}&ensp;
                                {tokenSymbol}
                              </Typography>
                            ) : getKeyId === item.recipient_id ? (
                              <Typography variant="body2" component="span" color={(theme) => theme.palette.error.light}>
                                + {util.formatFixed(item.amount, Number(digits!))}&ensp;
                                {tokenSymbol}
                              </Typography>
                            ) : (
                              <Typography variant="body2" component="span" ml={0.5}>
                                {util.formatFixed(item.amount, Number(digits!))}&ensp;
                                {tokenSymbol}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell align="center" colSpan={6}>
                        <Typography variant="body1">{t('login.no')}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {recordList && recordList.count ? (
              <TablePagination
                rowsPerPageOptions={[recordParams.params[0].limit]}
                component="div"
                count={recordList.count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  '& .MuiButtonBase-root.Mui-disabled': {
                    color: (theme) => theme.palette.surfaceContainerHigh.main
                  }
                }}
              />
            ) : (
              ''
            )}
          </>
        ) : (
          <SkeletonBox num={3}></SkeletonBox>
        )}
      </Box>
      <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }} width="100%">
        {recordList ? (
          <List
            sx={{ width: '100%', maxWidth: '100%', height: '60vh', overflowY: 'auto', pb: 5 }}
            onScroll={handleListScroll}>
            {recordList.list ? (
              recordList.list.map((item: RecordItem) => {
                return (
                  <ListItem
                    key={item.id}
                    sx={{
                      p: 2,
                      backgroundColor: (theme) => theme.palette.surfaceContainer.main,
                      borderRadius: 5,
                      mb: 2,
                      cursor: 'pointer'
                    }}>
                    <Box width="100%">
                      <Stack direction="row" justifyContent="space-between" mb={0.5} width="100%" spacing={2}>
                        <Stack direction="row" flexShrink={0}>
                          <Typography mr={1} variant="body2" fontSize={12}>
                            {t('home.block')}:
                          </Typography>
                          <Typography variant="body2" fontSize={12}>
                            {item.id}
                          </Typography>
                        </Stack>
                        <Stack direction="row" flex={1}>
                          <Typography mr={1} variant="body2" fontSize={12}>
                            {t('home.amount')}:
                          </Typography>
                          {getKeyId === item.sender_id ? '-' : getKeyId === item.recipient_id ? '+' : ''}
                          <Typography variant="body2" component="span" fontSize={12} ml={0.5}>
                            {util.formatFixed(item.amount, Number(digits!))}
                          </Typography>
                          <Typography variant="body2" component="span" ml={1} fontSize={12}>
                            {tokenSymbol}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" width="100%" spacing={2}>
                        <Stack direction="row" flexShrink={0}>
                          <Typography mr={1} variant="body2" fontSize={12}>
                            {t('home.date')}:
                          </Typography>
                          <Tooltip title={handleSecondUTC(item.created_at)} placement="bottom">
                            <Typography variant="body2" sx={{ cursor: 'pointer' }} fontSize={12}>
                              {handleSecond(item.created_at)}
                            </Typography>
                          </Tooltip>
                        </Stack>
                        <Stack direction="row" flex={1}>
                          <Typography mr={1} variant="body2" fontSize={12}>
                            {t('home.type')}:
                          </Typography>
                          <Typography variant="body2" component="span" fontSize={12}>
                            {t(util.eventType(Number(item.type)))}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" width="100%" spacing={2}>
                        <Stack direction="row" flexShrink={0} alignItems="center">
                          <Typography mr={1} variant="body2" fontSize={12}>
                            {t('home.address')}:
                          </Typography>
                          <Typography variant="body2" sx={{ cursor: 'pointer' }} fontSize={12}>
                            {keyring.addressString(item.recipient_id)}
                          </Typography>
                          <IconButton
                            color="primary"
                            aria-label="ContentCopyIcon"
                            onClick={() => {
                              util.copyToClipboard(keyring.addressString(item.recipient_id));
                              setIsOpen(true);
                            }}
                            size="medium">
                            <ContentCopyIcon fontSize="medium" sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Stack>
                      </Stack>
                      <Stack direction="row" alignItems="center">
                        <Typography mr={1} variant="body2" component="span" fontSize={12}>
                          {t('home.hash')}:
                        </Typography>
                        <Typography
                          fontSize={12}
                          variant="body2"
                          component="span"
                          sx={{
                            cursor: 'pointer',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '200px'
                          }}>
                          {item.txhash}
                        </Typography>
                        <IconButton
                          color="primary"
                          sx={{ fontSize: 14 }}
                          aria-label="ContentCopyIcon"
                          onClick={() => {
                            util.copyToClipboard(item.txhash);
                            setIsOpen(true);
                          }}
                          size="medium">
                          <ContentCopyIcon fontSize="medium" sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Stack>
                    </Box>
                  </ListItem>
                );
              })
            ) : (
              <Typography variant="body1">{t('login.no')}</Typography>
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
        ) : (
          <SkeletonBox num={3}></SkeletonBox>
        )}
      </Box>
      <Snackbar
        open={isOpen}
        autoHideDuration={6000}
        onClose={() => {
          setIsOpen(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          onClose={() => {
            setIsOpen(false);
          }}
          severity="success"
          sx={{ width: '100%' }}>
          {t('login.cody')}
        </Alert>
      </Snackbar>
    </MainContainer>
  );
};
