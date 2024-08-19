import { Typography, Box, Stack, Tooltip, List, ListItem, Button } from '@mui/material';
import MainContainer from '@/components/cantainer/MainContainer';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSelectTeam } from '@/store/team';
import { TeamItem, AffirmParams, DetailsItem, DetailsList, CountParams } from '@/dataType';
import { useCallback, useMemo, useState, useEffect } from 'react';
import util from '@/plugins/util';
import { handleMessageDetails } from '@/plugins/request/api';
import { handleSecondUTC, handleSecondMinute } from '@/plugins/day';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PasswordBox from '@/components/password/PasswordBox';
import SkeletonBox from '@/components/cantainer/SkeletonBox';
import { initMessageSearch } from '@/store/message';

export const Component = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const amount = searchParams.get('amount');
  const to = searchParams.get('to');
  const wallet = searchParams.get('wallet');
  const digits = searchParams.get('digits');
  const tokenSymbol = searchParams.get('tokenSymbol');
  const txhash = searchParams.get('tx_hash');
  const currNetwork = util.currNetwork();
  const created_at = searchParams.get('created_at');
  console.log('🚀 ~ file: Details.tsx:15 ~ Component ~ id:', id);
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const current = util.getCache('current');
  const [detailsList, setDetailsist] = useState<DetailsList | null>(null);
  const [isCheck, setIsCheck] = useState(false);
  const [contractParams, setContractParams] = useState({
    contractName: 'MultiSignConfirm',
    ProposalId: 0,
    Status: ''
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  console.log('🚀 ~ file: Details.tsx:16 ~ Component ~ current:', current);
  const affirmParams = useMemo(() => {
    const params: AffirmParams = {
      jsonrpc: '2.0',
      method: 'ibax.getList',
      id: 1,
      params: [
        {
          name: '@1multi_sign_confirmations',
          where: `{"proposal_id": ${id}}`,
          order: { id: -1 },
          offset: 0
        }
      ]
    };
    return params;
  }, [id]);
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
  const handleDetailsList = useCallback(async () => {
    const res = await handleMessageDetails(affirmParams);
    console.log('🚀 ~ file: Details.tsx:37 ~ handleDetailsList ~ res:', res);
    setDetailsist(res);
  }, [affirmParams]);
  const getList = useMemo(() => {
    if (teamSelect.owners) {
      const obj = JSON.parse(teamSelect.owners);
      const arr = Object.keys(obj);
      const details = detailsList ? detailsList.list : ([] as DetailsItem[]);
      const list = arr.map((item: string) => {
        const detailsItem = details ? details.find((ele: DetailsItem) => ele.creator === item) : '';
        return {
          account: item,
          status: detailsItem ? detailsItem.status : '',
          time: detailsItem ? detailsItem.created_at : '',
          isBtn: status === 'ongoing' && item === current.account ? true : false
        };
      });
      return list;
    }
    return [];
  }, [current.account, detailsList, status, teamSelect.owners]);
  useEffect(() => {
    handleDetailsList();
  }, [handleDetailsList]);
  const handleRejected = () => {
    setIsCheck(true);
    setContractParams({
      contractName: 'MultiSignConfirm',
      ProposalId: Number(id),
      Status: 'rejected'
    });
  };
  const handleApprove = () => {
    setIsCheck(true);
    setContractParams({
      contractName: 'MultiSignConfirm',
      ProposalId: Number(id),
      Status: 'approved'
    });
  };
  const handleClose = () => {
    setIsCheck(false);
  };
  const handleConfirm = async () => {
    setIsCheck(false);
    navigate('/message', { replace: true });
    await dispatch(initMessageSearch(countParams));
  };
  return (
    <MainContainer>
      <Typography variant="h5" mb={3}>
        {t('home.messageDetails')}
      </Typography>
      {to === teamSelect.wallet ? (
        <>
          <Stack direction="row" justifyContent="center" mb={1}>
            <Typography variant="body2" component="span" fontWeight={600}>
              {teamSelect.team_name}
            </Typography>
            <Typography variant="body2" component="span" ml={1}>
              {t('home.achieve', { to: wallet })}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="center">
            <Typography variant="body2" component="span" ml={0.5}>
              {util.formatFixed(amount!, Number(digits!))}
            </Typography>
            <Typography variant="body2" component="span" ml={0.5}>
              {tokenSymbol}
            </Typography>
          </Stack>
        </>
      ) : (
        <Box>
          <Box display="flex" justifyContent="center">
            <Box sx={{ width: { md: '60%', sm: '100%' } }}>
              <Typography variant="h6" mb={1} textAlign="center">
                {t('home.notice')}
              </Typography>
              <Tooltip title={handleSecondUTC(Number(created_at) * 1000)} placement="bottom">
                <Typography variant="body2" mb={1} textAlign="center" sx={{ cursor: 'pointer' }}>
                  {handleSecondMinute(Number(created_at))}
                </Typography>
              </Tooltip>
              {status === 'ongoing' ? (
                <Stack direction="row" justifyContent="center" mb={1}>
                  <Typography variant="body2" component="span">
                    {teamSelect.team_name}
                  </Typography>
                  <Typography variant="body2" component="span" ml={1}>
                    {t('home.initiate')}
                  </Typography>
                  <Typography variant="body2" component="span" ml={0.5}>
                    {util.formatFixed(amount!, Number(digits!))}
                  </Typography>
                  <Typography variant="body2" component="span" ml={0.5}>
                    {tokenSymbol}
                  </Typography>
                  <Typography variant="body2" component="span" ml={1}>
                    {t('home.wait')}
                  </Typography>
                </Stack>
              ) : status === 'finished' ? (
                <Stack direction="row" justifyContent="center" mb={1}>
                  <Typography variant="body2" component="span">
                    {teamSelect.team_name}
                  </Typography>
                  <Typography variant="body2" component="span" ml={1}>
                    {t('home.initiate')}
                  </Typography>
                  <Typography variant="body2" component="span" ml={0.5}>
                    {util.formatFixed(amount!, Number(digits!))}
                  </Typography>
                  <Typography variant="body2" component="span" ml={0.5}>
                    {tokenSymbol}
                  </Typography>
                  <Typography variant="body2" component="span" ml={1}>
                    {t('home.finish')}
                  </Typography>
                </Stack>
              ) : (
                ''
              )}
              <Stack direction="row" justifyContent="space-around" mb={3}>
                <Stack direction="row">
                  <Typography variant="body2">{t('home.current')}:</Typography>
                  <Typography variant="body2" ml={0.5}>
                    {detailsList ? detailsList.count : 0}
                  </Typography>
                </Stack>
                <Stack direction="row">
                  <Typography variant="body2">{t('home.tactics')}:</Typography>
                  <Typography variant="body2" ml={0.5}>
                    {teamSelect.threshold}-{teamSelect.owner_quantity}
                  </Typography>
                </Stack>
              </Stack>
              <List sx={{ display: { xs: 'none', sm: 'none', md: 'block', mb: 5 } }}>
                {getList.length ? (
                  getList.map((item: any, index) => {
                    return (
                      <ListItem key={index}>
                        <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center">
                          <Typography component="span" variant="body1" flex={3}>
                            {item.account}
                          </Typography>
                          <Typography component="span" variant="body1" ml={1} flex={0.5}>
                            {item.status === 'approved' ? (
                              <CheckIcon color="success" fontSize="large" />
                            ) : item.status === 'rejected' ? (
                              <CloseIcon color="error" fontSize="large" />
                            ) : (
                              <CheckIcon fontSize="large" />
                            )}
                          </Typography>
                          {item.time ? (
                            <Tooltip title={handleSecondUTC(Number(item.time) * 1000)} placement="bottom">
                              <Typography variant="body2" mb={1} textAlign="right" flex={3} sx={{ cursor: 'pointer' }}>
                                {handleSecondMinute(Number(item.time))}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography component="span" variant="body1" ml={0.5} flex={3} textAlign="center">
                              {item.isBtn ? (
                                <Typography
                                  component="span"
                                  variant="body1"
                                  ml={0.5}
                                  display="inline-flex"
                                  justifyContent="space-between">
                                  <Button variant="filled" onClick={handleApprove} sx={{ width: 'auto', ml: 2 }} size="large">
                                    {t('home.approved')}
                                  </Button>
                                  <Button variant="outlined" onClick={handleRejected} sx={{ width: 'auto', ml: 2 }} size="large">
                                    {t('home.rejected')}
                                  </Button>
                                </Typography>
                              ) : (
                                ''
                              )}
                            </Typography>
                          )}
                        </Stack>
                      </ListItem>
                    );
                  })
                ) : (
                  <SkeletonBox num={3}></SkeletonBox>
                )}
              </List>
            </Box>
          </Box>
          <List sx={{ display: { xs: 'block', sm: 'none', md: 'none', mb: 5 } }}>
            {getList.length ? (
              getList.map((item: any, index) => {
                return (
                  <ListItem
                    key={index}
                    sx={{
                      width: { sm: '100%', md: '48%' },
                      px: 3,
                      py: 2,
                      backgroundColor: (theme) => theme.palette.surfaceContainer.main,
                      borderRadius: 5,
                      mb: 2,
                      cursor: 'pointer'
                    }}>
                    <Box width="100%">
                      <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography component="span" variant="body2">
                          {item.account}
                        </Typography>
                        <Typography component="span" variant="body2" ml={1}>
                          {item.status === 'approved' ? (
                            <CheckIcon color="success" fontSize="medium" />
                          ) : item.status === 'rejected' ? (
                            <CloseIcon color="error" fontSize="medium" />
                          ) : (
                            <CheckIcon fontSize="medium" />
                          )}
                        </Typography>
                      </Stack>
                      <Stack>
                        {item.time ? (
                          <Tooltip title={handleSecondUTC(Number(item.time) * 1000)} placement="bottom">
                            <Typography variant="body2" mb={1} flex={2} sx={{ cursor: 'pointer' }}>
                              {handleSecondMinute(Number(item.time))}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography component="span" variant="body1" ml={0.5} flex={2}>
                            {item.isBtn ? (
                              <Typography
                                component="span"
                                variant="body1"
                                ml={0.5}
                                display="inline-flex"
                                justifyContent="space-between">
                                <Button variant="filled" onClick={handleApprove} sx={{ width: 'auto' }} size="large" >
                                  {t('home.approved')}
                                </Button>
                                <Button variant="outlined" onClick={handleRejected} sx={{ width: 'auto', ml: 1 }} size="large" >
                                  {t('home.rejected')}
                                </Button>
                              </Typography>
                            ) : (
                              ''
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  </ListItem>
                );
              })
            ) : (
              <SkeletonBox num={3}></SkeletonBox>
            )}
          </List>
        </Box>
      )}
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Button
          component={Link}
          to={`${currNetwork.blockexplorer}/blockchain/hash/${txhash}`}
          target="_blank"
          fullWidth={false}
          endIcon={<ArrowForwardIcon  />} size="large">
          {
            <Typography variant="body2" sx={{ ml: 1 }}>
              {t('home.explore')}
            </Typography>
          }
        </Button>
      </Box>
      <PasswordBox isCheck={isCheck} params={contractParams} close={handleClose} confirm={handleConfirm}></PasswordBox>
    </MainContainer>
  );
};
Component.displayName = 'detailsPage';
