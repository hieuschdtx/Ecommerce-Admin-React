import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useResponsive } from 'src/hooks/use-responsive';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { statusDefaultValues } from 'src/resources/order';
import { orderActionThunk } from 'src/redux/actions/order-action';

const phoneIsInvalidLength = 'Số điện thoại phải đủ 10 số và bắt đầu bằng số 0';
const fontSize = {
  fontSize: 13,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '24px',
  p: 3,
  overflowY: 'scroll hidden',
  height: '60vh',
  outline: 'none',
};

const defaultValues = {
  customer_name: '',
  customer_address: '',
  customer_email: '',
  customer_phone: '',
  note: '',
  payment_status: '',
  status: '',
};

const stylePaper = {
  p: 3,
  position: 'absolute',
  overflowY: 'scroll',
  top: 0,
  right: 0,
  bottom: 0,
  borderRadius: '16px',
  width: 1,
};

const defaultPaymentStatusValues = [
  { value: true, label: 'Đã Thanh toán' },
  { value: false, label: 'Chưa thanh toán' },
];

const schema = Yup.object()
  .shape({
    customer_name: Yup.string().required('Vui lòng nhập tên khách hàng'),
    customer_address: Yup.string().required('Vui lòng nhập địa chỉ'),
    customer_email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    customer_phone: Yup.string().matches(/^0\d{9}$/, phoneIsInvalidLength),
  })
  .required();

export default function OrderEdit({ open, handleClose }) {
  const mdUp = useResponsive('up', 'md');
  const { id } = useParams();
  const { orders } = useSelector((x) => x.rootReducer.orders);
  const { user } = useSelector((x) => x.rootReducer.user);

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const filterDataOrder = orders.find((item) => item.id === id);

  useEffect(() => {
    const val = { ...defaultValues, ...filterDataOrder, modified_by: user?.full_name };
    reset(val);
  }, [id]);

  const submitFormEdit = (value) => {
    dispatch(orderActionThunk.UpdateOrderDetail(value));
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={{ ...style, width: mdUp ? '60%' : '85%' }}>
        <Paper sx={stylePaper}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 4, right: 4 }}>
            <Iconify icon="iconamoon:close" width={24} height={24} />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Cập nhật đơn hàng
          </Typography>
          <Box>
            <form id="form" onSubmit={handleSubmit(submitFormEdit)}>
              <Stack direction="column" spacing={3}>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Code"
                        fullWidth
                        required
                        disabled
                        inputProps={{ sx: fontSize }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                  <Controller
                    name="customer_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tên người nhận"
                        fullWidth
                        error={!!errors.customer_name}
                        helperText={errors.customer_name?.message}
                        required
                        inputProps={{ sx: fontSize }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="customer_address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Địa chỉ giao hàng"
                        fullWidth
                        minRows={3}
                        multiline
                        error={!!errors.customer_address}
                        helperText={errors.customer_address?.message}
                        required
                        inputProps={{ sx: fontSize }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="customer_email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        error={!!errors.customer_email}
                        helperText={errors.customer_email?.message}
                        required
                        inputProps={{ sx: fontSize }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                  <Controller
                    name="customer_phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Số điện thoại"
                        fullWidth
                        error={!!errors.customer_phone}
                        helperText={errors.customer_phone?.message}
                        required
                        inputProps={{ sx: fontSize }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="note"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Ghi chú"
                        fullWidth
                        inputProps={{ sx: fontSize }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel sx={fontSize} id="discount-promotion">
                      Trạng thái thanh toán
                    </InputLabel>
                    <Controller
                      name="payment_status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="discount-promotion"
                          name="payment_status"
                          id="status-select"
                          label="Trạng thái thanh toán"
                          sx={fontSize}
                        >
                          {defaultPaymentStatusValues.map((item, index) => (
                            <MenuItem sx={fontSize} key={`${item}-${index}`} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel sx={fontSize} id="discount-promotion">
                      Trạng thái đơn hàng
                    </InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="discount-promotion"
                          name="status"
                          id="status-select"
                          label="Trạng thái đơn hàng"
                          sx={fontSize}
                        >
                          {statusDefaultValues.map((item, index) => {
                            if (item.value !== 0) {
                              return (
                                <MenuItem sx={fontSize} key={`${item}-${index}`} value={item.value}>
                                  {item.label}
                                </MenuItem>
                              );
                            }
                          })}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent={mdUp ? 'start' : 'space-between'}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting || !isDirty || !isValid}
                  >
                    Cập nhật
                  </Button>
                  <Button variant="outlined" type="button" onClick={handleClose}>
                    Hủy bỏ
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Container>
    </Modal>
  );
}
