import { createSlice } from '@reduxjs/toolkit';
import { userActionThunk } from '../actions/user-action';

const { getUserById } = userActionThunk;
const userSlice = createSlice({
  name: 'USER',
  initialState: {
    user: [],
    loading: false,
    message: '',
    success: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => ({
        ...state,
        loading: true,
      }))
      .addCase(getUserById.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        user: action.payload,
        message: 'OK',
        success: true,
      }))
      .addCase(getUserById.rejected, (state, action) => ({
        ...state,
        loading: false,
        message: action.error?.message,
        success: false,
        error: true,
      }));
  },
});

export default userSlice.reducer;
