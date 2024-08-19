import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  createSelector
  // nanoid
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { handleTeamList } from '@/plugins/request/api';
import { TeamList, TeamParams, TeamItem } from '@/dataType';
import type { RootState } from './index';

interface TeamListTypes extends TeamList {
  status: 'idle' | 'loading' | 'failed';
  teamSelect: TeamItem;
}

const teamRest = {
  created_at: '',
  creator: '',
  id: 0,
  owner_quantity: '',
  owners: '',
  team_name: '',
  threshold: '',
  wallet: '',
  isSelect: false
};
const teamAdapter = createEntityAdapter();
const initialState = teamAdapter.getInitialState<TeamListTypes>({
  list: [],
  count: 0,
  status: 'idle',
  teamSelect: {
    ...teamRest
  }
});
export const initTeamSearch = createAsyncThunk('team/search', async (params: TeamParams) => {
  const res = (await handleTeamList(params))!;
  return res;
});
export const addTeamSearch = createAsyncThunk('team/add', async (params: TeamParams) => {
  const res = (await handleTeamList(params))!;
  return res;
});
export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    resetTeam: () => initialState,
    resetTeamSelect: (state) => {
      state.teamSelect = teamRest;
    },
    teamDeleted: teamAdapter.removeOne,
    teamUpdateOne: teamAdapter.updateOne,
    teamSetAll: teamAdapter.setAll,
    teamUpdateMany: teamAdapter.updateMany,
    teamSelectData(state, action: PayloadAction<TeamItem>) {
      state.teamSelect = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initTeamSearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initTeamSearch.fulfilled, (state, action) => {
        const arr = action.payload.list ? action.payload.list : [];
        console.log('🚀 ~ file: team.ts:69 ~ .addCase ~ arr:', arr);
        const list = arr.length
          ? arr.map((item: TeamItem) => {
              item.isSelect = false;
              return item;
            })
          : [];
        teamAdapter.setAll(state, list);
        state.status = 'idle';
        state.count = action.payload ? action.payload.count : 0;
      })
      .addCase(initTeamSearch.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(addTeamSearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTeamSearch.fulfilled, (state, action) => {
        const list = action.payload.list
          ? action.payload.list.map((item: TeamItem) => {
              item.isSelect = false;
              return item;
            })
          : [];
        teamAdapter.addMany(state, list);
        state.status = 'idle';
        state.count = action.payload.count;
      })
      .addCase(addTeamSearch.rejected, (state) => {
        state.status = 'failed';
      });
  }
});
export const { teamDeleted, teamUpdateOne, teamSetAll, teamUpdateMany, teamSelectData, resetTeamSelect } =
  teamSlice.actions;
export const getSelectTeam = (state: RootState) => state.team.teamSelect;
export const count = (state: RootState) => state.team.count;
export const loadStatus = (state: RootState) => state.team.status;
export const ecosystemSelectors = teamAdapter.getSelectors<RootState>((state) => state.team);

export const {
  selectAll: selectAllTeam,
  selectById: selectTeamById,
  selectIds: selectTeamIds
} = teamAdapter.getSelectors((state: RootState) => state.team);

/* export const selectFilteredEcoIds = createSelector(
  // Pass our other memoized selector as an input
  selectAllTeam,
  // And derive data in the output selector
  (filteredEcoData) => filteredEcoData.map((item: any) => item.id)
); */
export const selectFilteredEcoIds = createSelector(
  // Pass our other memoized selector as an input
  [selectAllTeam, (_state, id) => id],
  // And derive data in the output selector
  (filteredEcoData, id) => filteredEcoData.filter((item) => item.id === id)
);
export const countTotal = createSelector(count, (count) => count);

export default teamSlice.reducer;
