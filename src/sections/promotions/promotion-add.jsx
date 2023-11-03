import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { promotionService } from 'src/apis/promotion-service';
import { useEffect } from 'react';
import { auth } from 'src/utils/auth';
import { notify } from 'src/utils/untils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '16px',
  p: 3,
  width: '50%',
};

const defaultValues = {
  name: '',
  discount: 0,
  from_day: null,
  to_day: null,
  status: true,
  created_by: '',
};

const defaultStatusValues = [
  { value: true, label: 'Sử dụng' },
  { value: false, label: 'Khóa' },
];

const schema = Yup.object({
  name: Yup.string().required('Vui lòng nhập tên'),
  discount: Yup.number()
    .required('Vui lòng nhập phần trăm giảm giá')
    .max(100, 'Không vượt quá 100%')
    .min(0, 'Phần trăm phải lớn hơn 0%'),
  from_day: Yup.date().required('Vui lòng chọn ngày bắt đầu'),
  to_day: Yup.date()
    .required('Vui lòng nhập ngày kết thúc')
    .min(Yup.ref('from_day'), 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'),
  status: Yup.boolean().required('Vui lòng chọn trạng thái'),
});

export default function PromotionAdd({ open, handleClose }) {
  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (value) => {
      handleClose();
      const { data, status } = await promotionService.createPromotion(value);
      notify(data.message, status);
      resetForm();
    },
  });

  useEffect(() => {
    const userData = auth.GetUserInfo();
    const { full_name } = userData;
    setFieldValue('created_by', full_name);
  }, [setFieldValue]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={style}>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 4, right: 4 }}>
          <Iconify icon="iconamoon:close" width={24} height={24} />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
          Create new Promotion
        </Typography>

        <Box>
          <form id="form" onSubmit={handleSubmit}>
            <Grid direction="row" container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tên"
                  name="name"
                  fullWidth
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phần trăm giảm giá"
                  name="discount"
                  fullWidth
                  value={values.discount}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.discount && !!errors.discount}
                  helperText={touched.discount && errors.discount}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label="Ngày bắt đầu"
                      onChange={(date) => setFieldValue('from_day', date)}
                      onBlur={handleBlur}
                      value={values.from_day}
                      name="from_day"
                      required
                    />
                  </DemoContainer>
                  {touched.from_day && !!errors.from_day && (
                    <FormHelperText error sx={{ margin: '3px 14px 0' }}>
                      {errors.from_day}
                    </FormHelperText>
                  )}
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label="Ngày kết thúc"
                      onChange={(date) => setFieldValue('to_day', date)}
                      onBlur={handleBlur}
                      value={values.to_day}
                      name="to_day"
                      required
                    />
                  </DemoContainer>
                  {touched.to_day && !!errors.to_day && (
                    <FormHelperText error sx={{ margin: '3px 14px 0' }}>
                      {errors.to_day}
                    </FormHelperText>
                  )}
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Trạng thái</InputLabel>
                  <Select
                    labelId="role-select-label"
                    name="status"
                    id="status-select"
                    value={values.status}
                    label="Trạng thái"
                    onChange={handleChange}
                    error={touched.status && !!errors.status}
                  >
                    {defaultStatusValues.map((item, index) => (
                      <MenuItem key={`${item}-${index}`} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.status && !!errors.status && (
                    <FormHelperText error>{errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </Modal>
  );
}

PromotionAdd.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
