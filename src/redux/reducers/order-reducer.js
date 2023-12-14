import { createSlice } from '@reduxjs/toolkit';
import { orderActionThunk } from '../actions/order-action';

const { GetAllOrder, FilterOrderDetail, UpdateOrderDetail, cleanMessage } = orderActionThunk;
const apiState = { loading: false, message: null, success: false, filterOrder: [] };

const orderSlice = createSlice({
  name: 'ORDER',
  initialState: {
    orders: [],
    loading: false,
    message: null,
    success: false,
    error: false,
    filterOrderId: { ...apiState },
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
      }))
      .addCase(GetAllOrder.rejected, (state, action) => ({
        ...state,
        loading: false,
        success: false,
        error: true,
        orders: [],
        message: action.error?.message,
      }))
      .addCase(FilterOrderDetail.pending, (state) => ({
        ...state,
        filterOrderId: { ...apiState, loading: true },
      }))
      .addCase(FilterOrderDetail.fulfilled, (state, action) => ({
        ...state,
        filterOrderId: { ...apiState, loading: false, success: true, filterOrder: action.payload },
      }))
      .addCase(FilterOrderDetail.rejected, (state, action) => ({
        ...state,
        filterOrderId: {
          ...apiState,
          loading: false,
          success: false,
          message: action.error?.message,
          filterOrder: [],
        },
      }))
      .addCase(UpdateOrderDetail.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(UpdateOrderDetail.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        message: action.payload?.message,
        success: true,
      }))
      .addCase(UpdateOrderDetail.rejected, (state, action) => ({
        ...state,
        loading: false,
        success: false,
        message: action.error?.message,
        error: true,
      }))
      .addCase(cleanMessage.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(cleanMessage.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        message: action.payload?.message,
      }));
  },
});

export default orderSlice.reducer;
