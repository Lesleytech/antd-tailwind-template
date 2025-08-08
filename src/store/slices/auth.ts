import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { noop } from 'lodash';

import { IAuthUser, IUserProfile } from '~/lib/types/user';
import { refreshToken } from '~/services/api/auth';
import { LocalStorageService } from '~/services/localStorage.service';
import { RootState } from '~/store';

const slice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: LocalStorageService.get('authUser') as IAuthUser | null,
  },
  reducers: {
    login: (auth, action: PayloadAction<IAuthUser>) => {
      auth.currentUser = action.payload;

      LocalStorageService.set('authUser', action.payload);
    },
    logout: (auth) => {
      auth.currentUser = null;

      LocalStorageService.remove('authUser');
    },
    setUserProfile: (auth, action: PayloadAction<IUserProfile>) => {
      if (auth.currentUser) {
        auth.currentUser.profile = action.payload;
      }
    },
    updateToken: (auth, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      if (!auth.currentUser) return;

      auth.currentUser.accessToken = action.payload.accessToken;
      auth.currentUser.refreshToken = action.payload.refreshToken;

      const { email } = auth.currentUser;

      LocalStorageService.set('authUser', { email, ...action.payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshUserToken.pending, noop)
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        if (!state.currentUser) return;

        const { email } = state.currentUser;
        const { accessToken, refreshToken } = action.payload;

        state.currentUser.accessToken = accessToken;
        state.currentUser.refreshToken = refreshToken;

        LocalStorageService.set('authUser', {
          email,
          accessToken,
          refreshToken,
        });
      })
      .addCase(refreshUserToken.rejected, (state) => {
        state.currentUser = null;

        LocalStorageService.remove('authUser');
      });
  },
});

const refreshUserToken = createAsyncThunk('auth/refreshToken', async (_, { getState }) => {
  const authUser = (getState() as RootState).auth.currentUser;

  if (!authUser) throw new Error('User is not authenticated');

  return refreshToken(authUser?.refreshToken ?? '');
});

export const authActions = slice.actions;
export const authAsyncActions = { refreshUserToken };
export const authReducer = slice.reducer;
