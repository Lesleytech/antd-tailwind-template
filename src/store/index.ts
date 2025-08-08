import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './slices/auth';
import { uiReducer } from './slices/ui';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
