import { configureStore } from '@reduxjs/toolkit';
import dmcReducer from './dmcSlice';

export const store = configureStore({
  reducer: {
    dmc: dmcReducer,
  },
});

export default store;