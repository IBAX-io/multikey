import { memo, useEffect, useMemo, useCallback } from 'react';
import { Badge, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getSelectTeam } from '@/store/team';
import { TeamItem, CountParams } from '@/dataType';
import { initMessageSearch, count } from '@/store/message';

const MessageCenter = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const total = useAppSelector(count);
  console.log('🚀 ~ file: MessageCenter.tsx:16 ~ MessageCenter ~ total:', total);
  const handleOpenList = () => {
    navigate('/message');
  };
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
  const handleGetCount = useCallback(async () => {
    await dispatch(initMessageSearch(countParams));
  }, [countParams, dispatch]);
  useEffect(() => {
    if (teamSelect.wallet) {
      handleGetCount();
    }
  }, [handleGetCount, teamSelect.wallet]);
  return (
    <>
      <IconButton size="large" color="inherit" onClick={handleOpenList}>
        {total ? (
          <Badge badgeContent={total} color="primary" max={99}>
            <CircleNotificationsIcon fontSize="large" />
          </Badge>
        ) : (
          <CircleNotificationsIcon fontSize="large" />
        )}
      </IconButton>
    </>
  );
};

export default memo(MessageCenter);
