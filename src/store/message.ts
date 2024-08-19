import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { handleMessageCount } from '@/plugins/request/api';
import { CountParams, CountList } from '@/dataType';
import type { RootState } from './index';

interface MessageTypes extends CountList {
  status: 'idle' | 'loading' | 'failed';
}

const messageAdapter = createEntityAdapter();
const initialState = messageAdapter.getInitialState<MessageTypes>({
  list: [],
  count: 0,
  status: 'idle'
});
export const initMessageSearch = createAsyncThunk('message/search', async (params: CountParams) => {
  const res = (await handleMessageCount(params))!;
  return res;
});
export const messageSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    resetTeam: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(initMessageSearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initMessageSearch.fulfilled, (state, action) => {
        state.status = 'idle';
        state.count = action.payload ? action.payload.count : 0;
      })
      .addCase(initMessageSearch.rejected, (state) => {
        state.status = 'failed';
      });
  }
});
export const count = (state: RootState) => state.message.count;
export const loadStatus = (state: RootState) => state.message.status;

export default messageSlice.reducer;
