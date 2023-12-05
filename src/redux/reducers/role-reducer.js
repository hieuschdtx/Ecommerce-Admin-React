import { createSlice } from '@reduxjs/toolkit';
import { roleActionThunk } from '../actions/role-action';

const { getRoleById } = roleActionThunk;

const roleSlice = createSlice({
  name: 'ROLE',
  initialState: {
    role: [],
    loading: false,
    message: '',
    success: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRoleById.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(getRoleById.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        message: 'OK',
        success: true,
        role: action.payload,
      }))
      .addCase(getRoleById.rejected, (state, action) => ({
        ...state,
        loading: false,
        success: false,
        error: true,
        message: action.error?.message,
      }));
  },
});

export default roleSlice.reducer;
