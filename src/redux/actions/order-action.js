import { createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from 'src/apis/order-service';
const defaultMessage = {
  message: null,
};

const GetAllOrder = createAsyncThunk('ORDER_GET_ALL_ORDER', async () => {
  const { data } = await orderService.GetAllOrder();
  return data;
});

const FilterOrderDetail = createAsyncThunk('ORDER_GET_BY_ID_ORDER', async (p) => {
  const { data } = await orderService.FilterOrderDetail(p);
  return data;
});

const cleanMessage = createAsyncThunk('CLEAN_MESSAGE', () => defaultMessage);

const UpdateOrderDetail = createAsyncThunk('ORDER_UPDATE_ORDER', async (p) => {
  const { data } = await orderService.UpdateOrder(p);
  return data;
});

export const orderActionThunk = {
  GetAllOrder,
  FilterOrderDetail,
  UpdateOrderDetail,
  cleanMessage,
};
