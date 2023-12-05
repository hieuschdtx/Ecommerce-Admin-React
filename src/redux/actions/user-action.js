import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from 'src/apis/user-service';

const getUserById = createAsyncThunk('USER_GET_BY_ID_USER', async (p) => {
  const { data } = await userService.getUserById(p);
  return data;
});

export const userActionThunk = {
  getUserById,
};
