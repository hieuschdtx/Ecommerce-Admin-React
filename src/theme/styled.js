import { Button, styled as MUIStyled } from '@mui/material';
import { grey } from './palette';

const CustomButton = MUIStyled(Button)(({ theme, padding, disabled, colors }) => ({
  backgroundColor: `${!disabled ? colors : grey[400]}`,
  display: 'flex',
  textTransform: 'none',
  gap: 6,
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  borderRadius: 4,
  padding: `${padding}`,
  '&:hover': {
    backgroundColor: colors,
  },
}));

export { CustomButton };
