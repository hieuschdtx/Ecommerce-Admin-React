import { createAsyncThunk } from '@reduxjs/toolkit';
import { promotionService } from 'src/apis/promotion-service';

const getPromotions = createAsyncThunk('PROMOTIONS_GET_PROMOTIONS', async () => {
  const { data } = await promotionService.getPromotion();
  return data;
});

export const promotionActionThunk = {
  getPromotions,
};
