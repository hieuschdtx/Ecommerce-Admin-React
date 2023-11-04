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
import { useEffect, useMemo, useState } from 'react';
import { auth } from 'src/utils/auth';
import { notify } from 'src/utils/untils';
import { useSelector } from 'react-redux';
import parseISO from 'date-fns/parseISO';

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
  id: '',
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

const schema = Yup.object()
  .shape({
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
  })
  .required();

export default function PromotionAdd({ open, setOpen, isEdit, id = '' }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const { promotion } = useSelector((state) => state.rootReducer.promotions);
  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (value) => {
      handleClose();
      const { data, status } = await handleSubmitForm(value);
      notify(data.message, status);
      resetForm();
    },
  });

  const handleSubmitForm = async (value) => {
    if (isEdit && id !== '') {
      const data = await promotionService.updatePromotion(id, value);
      console.log(data);
      return data;
    }
    const data = await promotionService.createPromotion(value);
    return data;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const dataPromotion = useMemo(() => {
    if (isEdit) {
      const data = promotion.find((item) => item.id === id);
      const { from_day, to_day } = data;
      return { ...data, from_day: parseISO(from_day), to_day: parseISO(to_day) };
    }
    return {};
  }, [id, promotion, isEdit]);

  useEffect(() => {
    if (isEdit) {
      const val = { ...defaultValues, ...dataPromotion };
      setValues(val);
    }
  }, [isEdit, dataPromotion, setValues]);

  useEffect(() => {
    const userData = auth.GetUserInfo();
    const { full_name } = userData;
    setFieldValue('created_by', full_name);
    if (isEdit) {
      setFieldValue('modified_by', full_name);
    }
  }, [setFieldValue, isEdit]);

  useEffect(() => {
    const { name, discount, from_day, to_day, status } = values;
    setIsDisabled(
      !(
        name !== dataPromotion.name ||
        discount !== dataPromotion.discount ||
        status !== dataPromotion.status ||
        from_day !== dataPromotion.from_day ||
        to_day !== dataPromotion.to_day
      )
    );
  }, [
    values,
    dataPromotion.discount,
    dataPromotion.name,
    dataPromotion.from_day,
    dataPromotion.status,
    dataPromotion.to_day,
  ]);

  return (
    <Modal
      open={open}
      onClose={setOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={style}>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 4, right: 4 }}>
          <Iconify icon="iconamoon:close" width={24} height={24} />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
          {isEdit ? 'Cập nhật giảm giá' : 'Tạo mới mục giảm giá'}
        </Typography>

        <Box>
          <form id="form" onSubmit={handleSubmit}>
            <Grid direction="row" container spacing={2}>
              {isEdit && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Id"
                    name="id"
                    fullWidth
                    value={values?.id}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched?.id && !!errors?.id}
                    helperText={touched?.id && errors?.id}
                    required
                    disabled
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tên"
                  name="name"
                  fullWidth
                  value={values?.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched?.name && !!errors?.name}
                  helperText={touched?.name && errors?.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phần trăm giảm giá"
                  name="discount"
                  fullWidth
                  value={values?.discount}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched?.discount && !!errors?.discount}
                  helperText={touched?.discount && errors?.discount}
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
                      value={values?.from_day}
                      name="from_day"
                      required
                    />
                  </DemoContainer>
                  {touched?.from_day && !!errors?.from_day && (
                    <FormHelperText error sx={{ margin: '3px 14px 0' }}>
                      {errors?.from_day}
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
                      value={values?.to_day}
                      name="to_day"
                      required
                    />
                  </DemoContainer>
                  {touched?.to_day && !!errors?.to_day && (
                    <FormHelperText error sx={{ margin: '3px 14px 0' }}>
                      {errors?.to_day}
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
                    value={values?.status}
                    label="Trạng thái"
                    onChange={handleChange}
                    error={touched?.status && !!errors?.status}
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
              <Grid item xs={isEdit ? 6 : 12}>
                <Button
                  variant="contained"
                  color={isEdit ? 'error' : 'primary'}
                  type="submit"
                  disabled={isEdit && isDisabled}
                >
                  {isEdit ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </Grid>
              {isEdit && (
                <Grid item xs={isEdit && 6} textAlign="end">
                  <Button variant="contained" color="info" type="button" onClick={handleClose}>
                    Hủy bỏ
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </Box>
      </Container>
    </Modal>
  );
}

PromotionAdd.propTypes = {
  open: PropTypes.bool,
  isEdit: PropTypes.bool,
  id: PropTypes.string,
  setOpen: PropTypes.func,
};
