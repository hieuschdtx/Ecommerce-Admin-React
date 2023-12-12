import { common } from '@mui/material/colors';
import { error, grey, success, warning } from 'src/theme/palette';

export const statusDefaultValues = [
  {
    label: 'Tất cả',
    value: 0,
    color: common.black,
  },
  {
    label: 'Đang chuẩn bị',
    value: 1,
    color: warning.dark,
  },
  {
    label: 'Đã giao',
    value: 2,
    color: success.main,
  },
  {
    label: 'Hoàn lại tiền',
    value: 3,
    color: grey[600],
  },

  {
    label: 'Bị hủy',
    value: -1,
    color: error.main,
  },
];
