import { useState, useEffect, useMemo, useCallback, UIEvent, useRef } from 'react';
import {
  Stack,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Tooltip,
  Button,
  TablePagination,
  Box,
  List,
  ListItem,
  CircularProgress
} from '@mui/material';
import MainContainer from '@/components/cantainer/MainContainer';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getSelectTeam } from '@/store/team';
import { TeamItem, MessageItem, MessageList, MessageParams } from '@/dataType';
import { handleMessageList, handleBatchRequests } from '@/plugins/request/api';
import { handleSecondUTC, handleSecondsAgo } from '@/plugins/day';
import util from '@/plugins/util';
import { createSearchParams, useNavigate } from 'react-router-dom';
import SkeletonBox from '@/components/cantainer/SkeletonBox';

export const Component = () => {
  const { t } = useTranslation();
  const [messageList, setMessageList] = useState<MessageList | null>(null);
  const [ecoList, setEcoList] = useState<any[] | null>(null);
  const [page, setPage] = useState(0);
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const navigate = useNavigate();
  const pageRef = useRef(1);
  const [scrollLoad, setScrollLoad] = useState(false);
  const [isMore, setIsmore] = useState(false);
  const limit = 10;
  const messageParams = useMemo(() => {
    const params: MessageParams = {
      jsonrpc: '2.0',
      method: 'ibax.getList',
      id: 1,
      params: [
        {
          name: '@1multi_sign_proposals',
          where: `{"$or": ["wallet": "${teamSelect.wallet}", "$and": [{"to":"${teamSelect.wallet}"},{"status": "finished"}]]}`,
          offset: 0,
          limit,
          order: { id: -1 }
        }
      ]
    };
    return params;
  }, [teamSelect.wallet]);
  const [rowsPerPage, setRowsPerPage] = useState(messageParams.params[0].limit);
  const handleGetMessageList = useCallback(async () => {
    const res = await handleMessageList(messageParams);
    console.log('🚀 ~ file: MessageList.tsx:50 ~ handleGetMessageList ~ res:', res);
    if (res?.list) {
      const balanceParams = [] as any;
      res.list.forEach((item: MessageItem) => {
        balanceParams.push({
          jsonrpc: '2.0',
          method: 'ibax.ecosystemInfo',
          id: 2,
          params: [Number(item.ecosystem)]
        });
      });
      const data = await handleBatchRequests(balanceParams);
      setEcoList(data);
      setMessageList(res);
    } else {
      setEcoList(null);
      setMessageList(null);
    }
  }, [messageParams]);
  useEffect(() => {
    if (teamSelect.wallet) {
      handleGetMessageList();
    }
  }, [handleGetMessageList, teamSelect.wallet]);
  const handleChangePage = async (_event: unknown, newPage: number) => {
    messageParams.params[0].offset = newPage * messageParams.params[0].limit;
    setPage(newPage);
    const res = await handleMessageList(messageParams);
    if (res) {
      const balanceParams = [] as any;
      res.list.forEach((item: MessageItem) => {
        balanceParams.push({
          jsonrpc: '2.0',
          method: 'ibax.ecosystemInfo',
          id: 2,
          params: [Number(item.ecosystem)]
        });
      });
      const data = await handleBatchRequests(balanceParams);
      setEcoList(data);
      setMessageList(res);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleMeassageDetails = (item: MessageItem, result: any) => {
    console.log('🚀 ~ file: MessageList.tsx:97 ~ handleMeassageDetails ~ result:', result);
    console.log('🚀 ~ file: MessageList.tsx:97 ~ handleMeassageDetails ~ item:', item);
    const params = {
      ...item,
      digits: result.digits,
      tokenSymbol: result.token_symbol,
      tokenName: result.token_name
    };
    navigate({ pathname: '/message/details', search: `?${createSearchParams(params)}` });
  };
  const handleListScroll = async (event: UIEvent<HTMLUListElement>) => {
    console.log('🚀 ~ file: MessageList.tsx:111 ~ handleListScroll ~ event:', event);
    if (scrollLoad) {
      return;
    }
    const { target } = event;
    const dom: HTMLElement = target as HTMLElement;
    const { scrollHeight, scrollTop, offsetHeight } = dom;
    if (scrollTop + offsetHeight >= scrollHeight - 25) {
      const num = Math.ceil(messageList!.count / limit);
      if (num > pageRef.current && !scrollLoad) {
        setScrollLoad(true);
        pageRef.current += 1;
        messageParams.params[0].offset = (pageRef.current - 1) * limit;
        setTimeout(async () => {
          const res = await handleMessageList(messageParams);
          const num = Math.ceil(messageList!.count / limit);
          console.log('🚀 ~ file: Record.tsx:148 ~ setTimeout ~ num:', num);
          if (num > pageRef.current) {
            setIsmore(true);
          } else {
            setIsmore(false);
          }
          if (res) {
            const balanceParams = [] as any;
            res.list.forEach((item: MessageItem) => {
              balanceParams.push({
                jsonrpc: '2.0',
                method: 'ibax.ecosystemInfo',
                id: 2,
                params: [Number(item.ecosystem)]
              });
            });
            const data = await handleBatchRequests(balanceParams);
            setEcoList(() => {
              return [...ecoList!, ...data];
            });
            setMessageList(() => {
              return {
                count: res!.count,
                list: [...messageList!.list, ...res!.list]
              };
            });
          }
          setScrollLoad(false);
        }, 500);
      }
    }
  };
  return (
    <MainContainer>
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
        {messageList ? (
          <>
            <TableContainer sx={{ minHeight: 500 }}>
              <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                <TableBody>
                  {messageList.list && ecoList ? (
                    messageList.list.map((item: MessageItem, index) => {
                      return (
                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={item.id}>
                          <TableCell align="left" width={200}>
                            <Tooltip title={handleSecondUTC(Number(item.created_at) * 1000)} placement="bottom">
                              <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                                {handleSecondsAgo(Number(item.created_at)) < 60
                                  ? `${handleSecondsAgo(Number(item.created_at))} ${t('home.second')}`
                                  : handleSecondsAgo(Number(item.created_at))}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">
                            {item.to === teamSelect.wallet ? (
                              <Stack direction="row">
                                <Box
                                  sx={{
                                    cursor: 'pointer',
                                    color: (theme) => theme.palette.primary.main,
                                    textDecoration: 'underline'
                                  }}
                                  onClick={() => {
                                    handleMeassageDetails(item, ecoList[index].result);
                                  }}>
                                  <Typography variant="body2" component="span" fontWeight={600}>
                                    {teamSelect.team_name}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={1}>
                                    {t('home.achieve', { to: item.wallet })}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={0.5}>
                                    {util.formatFixed(item.amount, ecoList[index].result.digits)}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={0.5}>
                                    {ecoList[index].result.token_symbol}
                                  </Typography>
                                </Box>
                              </Stack>
                            ) : item.status === 'ongoing' ? (
                              <Stack direction="row">
                                <Box
                                  sx={{
                                    cursor: 'pointer',
                                    color: (theme) => theme.palette.primary.main,
                                    textDecoration: 'underline'
                                  }}
                                  onClick={() => {
                                    handleMeassageDetails(item, ecoList[index].result);
                                  }}>
                                  <Typography variant="body2" component="span" fontWeight={600}>
                                    {teamSelect.team_name}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={1}>
                                    {t('home.initiate')}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={0.5}>
                                    {util.formatFixed(item.amount, ecoList[index].result.digits)}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={0.5}>
                                    {ecoList[index].result.token_symbol},
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={1}>
                                    {t('home.wait')}
                                  </Typography>
                                </Box>
                              </Stack>
                            ) : item.status === 'finished' ? (
                              <Stack direction="row">
                                <Box
                                  sx={{
                                    cursor: 'pointer',
                                    color: (theme) => theme.palette.primary.main,
                                    textDecoration: 'underline'
                                  }}
                                  onClick={() => {
                                    handleMeassageDetails(item, ecoList[index].result);
                                  }}>
                                  <Typography variant="body2" component="span" fontWeight={600}>
                                    {teamSelect.team_name}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={1}>
                                    {t('home.initiate')}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={0.5}>
                                    {util.formatFixed(item.amount, ecoList[index].result.digits)}
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={0.5}>
                                    {ecoList[index].result.token_symbol},
                                  </Typography>
                                  <Typography variant="body2" component="span" ml={1}>
                                    {t('home.finish')}
                                  </Typography>
                                </Box>
                              </Stack>
                            ) : (
                              ''
                            )}
                          </TableCell>
                          <TableCell align="center">2/{teamSelect.owner_quantity}</TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() => {
                                handleMeassageDetails(item, ecoList[index].result);
                              }}
                              sx={{ fontSize: 12 , minWidth: 150}} size="large">
                              {t('home.examine')}
                            </Button>
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
            {messageList && messageList.count ? (
              <TablePagination
                rowsPerPageOptions={[messageParams.params[0].limit]}
                component="div"
                count={messageList.count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : (
              <SkeletonBox num={3}></SkeletonBox>
            )}
          </>
        ) : (
          <Typography textAlign="center">{t('home.noMessage')}</Typography>
        )}
      </Box>
      <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }} width="100%">
        {messageList ? (
          <List
            sx={{ width: '100%', maxWidth: '100%', height: '80vh', overflowY: 'auto', pb: 5 }}
            onScroll={handleListScroll}>
            {messageList.list && ecoList ? (
              messageList.list.map((item: MessageItem, index) => {
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
                        <Stack direction="row" flexShrink={0} alignItems="center">
                          <Typography mr={1} variant="body2" fontSize={12}>
                            {t('home.time')}:
                          </Typography>
                          <Tooltip title={handleSecondUTC(Number(item.created_at) * 1000)} placement="bottom">
                            <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                              {handleSecondsAgo(Number(item.created_at)) < 60
                                ? `${handleSecondsAgo(Number(item.created_at))} ${t('home.second')}`
                                : handleSecondsAgo(Number(item.created_at))}
                            </Typography>
                          </Tooltip>
                        </Stack>
                        <Stack direction="row" flexShrink={0} alignItems="center">
                          <Typography mr={1} variant="body2" fontSize={12}>
                            {t('home.signnum')}:
                          </Typography>
                          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
                            {teamSelect.threshold}/{teamSelect.owner_quantity}
                          </Typography>
                        </Stack>
                        <Button
                          onClick={() => {
                            handleMeassageDetails(item, ecoList[index].result);
                          }}
                          sx={{ fontSize: 12, minWidth: 150 }} size="large">
                          {t('home.examine')}
                        </Button>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" width="100%" mb={1}>
                        <Stack
                          direction="row"
                          flexShrink={0}
                          alignItems="center"
                          flexWrap="wrap"
                          sx={{ wordBreak: 'break-word' }}>
                          {item.status === 'ongoing' ? (
                            <Stack direction="row" flexWrap="wrap">
                              <Typography variant="body2" component="span" fontSize={12}>
                                {teamSelect.team_name}
                              </Typography>
                              <Typography variant="body2" component="span" ml={1} fontSize={12}>
                                {t('home.initiate')}
                              </Typography>
                              <Typography variant="body2" component="span" ml={0.5} fontSize={12}>
                                {util.formatFixed(item.amount, ecoList[index].result.digits)}
                              </Typography>
                              <Typography variant="body2" component="span" ml={0.5} fontSize={12}>
                                {ecoList[index].result.token_symbol}
                              </Typography>
                              <Typography variant="body2" component="span" ml={1} fontSize={12}>
                                {t('home.wait')}
                              </Typography>
                            </Stack>
                          ) : item.status === 'finished' ? (
                            <Stack direction="row" flexWrap="wrap">
                              <Typography variant="body2" component="span" fontSize={12} fontWeight={600}>
                                {teamSelect.team_name}
                              </Typography>
                              <Typography variant="body2" component="span" ml={1} fontSize={12}>
                                {t('home.initiate')}
                              </Typography>
                              <Typography variant="body2" component="span" ml={0.5} fontSize={12}>
                                {util.formatFixed(item.amount, ecoList[index].result.digits)}
                              </Typography>
                              <Typography variant="body2" component="span" ml={0.5} fontSize={12}>
                                {ecoList[index].result.token_symbol}
                              </Typography>
                              <Typography variant="body2" component="span" ml={1} fontSize={12}>
                                {t('home.finish')}
                              </Typography>
                            </Stack>
                          ) : (
                            ''
                          )}
                        </Stack>
                      </Stack>

                      {item.to === teamSelect.wallet ? (
                        <Stack direction="row" flexWrap="wrap">
                          <Typography variant="body2" component="span" sx={{ fontWeight: 600 }} fontSize={12}>
                            {teamSelect.team_name}
                          </Typography>
                          <Typography variant="body2" component="span" ml={1} fontSize={12}>
                            {t('home.achieve', { to: item.to })}
                          </Typography>
                          <Typography variant="body2" component="span" ml={0.5} fontSize={12}>
                            {util.formatFixed(item.amount, ecoList[index].result.digits)}
                          </Typography>
                          <Typography variant="body2" component="span" ml={0.5} fontSize={12}>
                            {ecoList[index].result.token_symbol}
                          </Typography>
                        </Stack>
                      ) : (
                        ''
                      )}
                    </Box>
                  </ListItem>
                );
              })
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
        ) : (
          <Typography variant="body1" textAlign="center">
            {t('login.no')}
          </Typography>
        )}
      </Box>
    </MainContainer>
  );
};
Component.displayName = 'MessagePage';
