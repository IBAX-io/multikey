import type { AppDispatch, RootState } from '@/store';
import type { EntityId } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export type useEntityId = EntityId;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = (params) => {
  return useSelector(params, shallowEqual);
};
