import { createSlice } from '@reduxjs/toolkit';
import { promotionActionThunk } from '../actions/promotion-action';

const { getPromotions } = promotionActionThunk;

const promotionSlice = createSlice({
  name: 'PROMOTION',
  initialState: {
    promotion: [],
    loading: false,
    message: '',
    success: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPromotions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotion = action.payload;
        state.success = true;
      });
  },
});

export default promotionSlice.reducer;
