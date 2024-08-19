import { configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, Action } from '@reduxjs/toolkit';
import teamReducer from './team';
import langReducer from './lang';
import messageReducer from './message';
export const store = configureStore({
  reducer: {
    team: teamReducer,
    lang: langReducer,
    message: messageReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
