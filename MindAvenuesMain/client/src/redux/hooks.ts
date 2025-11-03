//src/redux/hooks.ts
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { AppDispatch, RootState } from './store';

export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;