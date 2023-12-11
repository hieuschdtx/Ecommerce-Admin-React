import { createSlice } from '@reduxjs/toolkit';
import { orderActionThunk } from '../actions/order-action';

const { GetAllOrder } = orderActionThunk;

const orderSlice = createSlice({
  name: 'ORDER',
  initialState: {
    orders: [],
    loading: false,
    message: '',
    success: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllOrder.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(GetAllOrder.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        orders: action.payload,
        success: true,
        message: 'OK',
      }))
      .addCase(GetAllOrder.rejected, (state, action) => ({
        ...state,
        loading: false,
        success: false,
        error: true,
        orders: [],
        message: action.error?.message,
      }));
  },
});

export default orderSlice.reducer;
