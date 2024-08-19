import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from './index';
import * as locales from '@mui/material/locale';
import type { PayloadAction } from '@reduxjs/toolkit';
type SupportedLocales = keyof typeof locales;

const langAdapter = createEntityAdapter();
const value = localStorage.getItem('lang');
const initialState = langAdapter.getInitialState({
  value: value || 'en-US',
  locale: (value ? value.replace('-', '') : 'enUS') as SupportedLocales
});
export const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    resetLang: () => initialState,
    valueData(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    localeData(state, action: PayloadAction<string>) {
      console.log('🚀 ~ file: lang.ts:22 ~ localeData ~ action:', action);
      state.locale = action.payload.replace('-', '') as SupportedLocales;
    }
  }
});
export const langValue = (state: RootState) => state.lang.value;
export const langLocale = (state: RootState) => state.lang.locale;
export const { resetLang, valueData, localeData } = langSlice.actions;
export default langSlice.reducer;
