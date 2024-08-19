import { memo, UIEvent, useMemo, useRef } from 'react';
import { Autocomplete, TextField, ListItem, Typography, ListItemText } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectAllTeam,
  getSelectTeam,
  selectTeamIds,
  teamUpdateMany,
  teamUpdateOne,
  teamSelectData,
  loadStatus,
  count,
  addTeamSearch
} from '@/store/team';
import { TeamItem, TeamParams } from '@/dataType';
import util from '@/plugins/util';
import CheckIcon from '@mui/icons-material/Check';
//import { useNavigate } from 'react-router-dom';
const win = window;
const TeamName = ({ close }: { close: () => void }) => {
  const current = util.getCache('current');
  //const navigate = useNavigate();
  const teamAllTeam = useAppSelector(selectAllTeam) as TeamItem[];
  const teamSelect: TeamItem = useAppSelector(getSelectTeam);
  const teamIds = useAppSelector(selectTeamIds);
  const dispatch = useAppDispatch();
  const status = useAppSelector(loadStatus);
  const total = useAppSelector(count);
  const page = useRef(1);
  const teamParams = useMemo(() => {
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
  }, [current.account]);
  const handleChangeTeam = (newValue: TeamItem | null) => {
    if (newValue && newValue.id !== teamSelect.id) {
      util.setCache('teamSelect', newValue);
      const arr = teamIds.map((item) => {
        return {
          id: item,
          changes: { isSelect: false }
        };
      });
      dispatch(teamUpdateMany(arr as any));
      dispatch(
        teamUpdateOne({
          id: newValue.id,
          changes: { isSelect: true } as any
        })
      );
      dispatch(teamSelectData(newValue));
      // navigate('/', { replace: true });
      win.location.href = '/';
      close();
    }
  };
  let scrollLoad = false;
  const handleListScroll = async (event: UIEvent<HTMLUListElement>) => {
    if (scrollLoad) {
      return;
    }
    const listboxNode = event.currentTarget;
    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 50) {
      console.log(total);
      const num = Math.ceil(total / teamParams.params[0].limit);
      console.log('🚀 ~ file: TeamName.tsx:77 ~ handleListScroll ~ num:', num);
      if (num > page.current && status === 'idle') {
        scrollLoad = true;
        page.current += 1;
        console.log(page.current);
        const offset = teamParams.params[0].limit * (page.current - 1);
        teamParams.params[0].offset = offset;
        const ecoSeacrch = await dispatch(addTeamSearch(teamParams));
        if (addTeamSearch.fulfilled.match(ecoSeacrch)) {
          scrollLoad = false;
        }
      }
    }
  };
  return (
    <>
      <Autocomplete
        freeSolo
        id="team-name"
        sx={{ width: { xs: 200, sm: 200, md: 300 }, margin: { xs: '0 auto', sm: '0 auto', md: 0 } }}
        size="medium"
        value={teamSelect}
        options={teamAllTeam}
        getOptionLabel={(option: any) => {
          return option.team_name;
        }}
        onChange={(_event: any, newValue: any) => {
          handleChangeTeam(newValue);
        }}
        disableClearable
        clearIcon=""
        ListboxProps={{
          onScroll: handleListScroll
        }}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            className="team-search"
            {...params}
            InputProps={{
              ...params.InputProps,
              type: 'search'
            }}
          />
        )}
        renderOption={(props, item: TeamItem) => {
          return (
            <ListItem {...props} key={item.id}>
              {item.isSelect ? <CheckIcon color="success" /> : <Typography fontSize={20} width={20}></Typography>}
              <ListItemText primary={item.team_name} sx={{ ml: 1 }} />
            </ListItem>
          );
        }}
      />
    </>
  );
};
export default memo(TeamName);
