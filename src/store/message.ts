import { BalanceParams, BalanceType, CountList, CountParams } from '@/dataType';
import { handleEcoBalance, handleMessageCount } from '@/plugins/request/api';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { RootState } from './index';

interface Balance {
  balance: BalanceType | null;
}
interface MessageTypes extends Balance, CountList {
  status: 'idle' | 'loading' | 'failed';
}
const messageAdapter = createEntityAdapter();
const initialState = messageAdapter.getInitialState<MessageTypes>({
  list: [],
  count: 0,
  status: 'idle',
  balance: null
});
export const initMessageSearch = createAsyncThunk('message/search', async (params: CountParams) => {
  const res = (await handleMessageCount(params))!;
  return res;
});
export const initBalance = createAsyncThunk('message/balance', async (params: BalanceParams) => {
  const res = (await handleEcoBalance(params))!;
  return res[0].result;
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
      })
      .addCase(initBalance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initBalance.fulfilled, (state, action) => {
        state.status = 'idle';
        state.balance = action.payload ? action.payload : null;
      })
      .addCase(initBalance.rejected, (state) => {
        state.status = 'failed';
      });
  }
});
export const count = (state: RootState) => state.message.count;
export const loadStatus = (state: RootState) => state.message.status;
export const getBalance = (state: RootState) => state.message.balance;
export default messageSlice.reducer;
