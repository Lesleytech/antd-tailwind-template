import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

import { ColorMode } from '~/lib/types/colorMode';
import { LocalStorageService } from '~/services/localStorage.service';

const initialState = {
  colorMode: 'light' as ColorMode,
  modals: {
    modal1: {
      visible: false,
      data: null,
    },
  },
};

type TModals = typeof initialState.modals;
export type TModalNames = keyof TModals;
export type TModalData<T extends TModalNames> = (typeof initialState.modals)[T]['data'];

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setColorMode: (ui, action: PayloadAction<ColorMode>) => {
      ui.colorMode = action.payload;

      LocalStorageService.set('colorMode', ui.colorMode);
    },
    openModal: <T extends TModalNames>(
      ui: Draft<typeof initialState>,
      { payload }: PayloadAction<{ name: T; data?: TModalData<T> } | T>,
    ) => {
      if (typeof payload === 'string') {
        ui.modals[payload].visible = true;
        ui.modals[payload].data = null;
      } else {
        ui.modals[payload.name].visible = true;
        ui.modals[payload.name].data = payload.data || null;
      }
    },
    closeModal: (ui, { payload }: PayloadAction<TModalNames>) => {
      ui.modals[payload].visible = false;
      ui.modals[payload].data = null;
    },
  },
});

export const uiActions = slice.actions;
export const uiReducer = slice.reducer;
