import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from 'src/apis/order-service';

const GetAllOrder = createAsyncThunk('ORDER_GET_ALL_ORDER', async () => {
  const { data } = await orderService.GetAllOrder();
  return data;
});

export const orderActionThunk = {
  GetAllOrder,
};
