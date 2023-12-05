import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from 'src/apis/user-service';

const getRoleById = createAsyncThunk('USER_GET_ROLE_BY_ID_USER', async (p) => {
  const { data } = await userService.getRoleById(p);
  return data;
});

export const roleActionThunk = {
  getRoleById,
};
