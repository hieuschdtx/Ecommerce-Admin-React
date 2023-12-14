import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { promotionService } from 'src/apis/promotion-service';
import { useEffect, useMemo } from 'react';
import { notify } from 'src/utils/untils';
import { useSelector } from 'react-redux';
import parseISO from 'date-fns/parseISO';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResponsive } from 'src/hooks/use-responsive';
import { CustomButton } from 'src/theme/styled';
import { info, primary } from 'src/theme/palette';

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
  borderRadius: '16px',
  p: 3,
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
      .typeError('Phần trăm phải là số')
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
  const { promotion } = useSelector((state) => state.rootReducer.promotions);
  const { user } = useSelector((x) => x.rootReducer.user);
  const mdUp = useResponsive('up', 'md');

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const submitForm = async (value) => {
    const {
      data: { message },
      status,
    } = await handleSubmitForm({
      ...value,
      created_by: user.full_name,
      modified_by: user.full_name,
    });
    notify(message, status);
    reset(defaultValues);
  };

  const handleSubmitForm = async (param) => {
    if (isEdit && id) {
      return await promotionService.updatePromotion(param);
    }
    return await promotionService.createPromotion(param);
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
      reset(val);
    }
  }, [isEdit, dataPromotion]);

  return (
    <Modal
      open={open}
      onClose={setOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={{ ...style, width: mdUp ? '60%' : '85%' }}>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 4, right: 4 }}>
          <Iconify icon="iconamoon:close" width={24} height={24} />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
          {isEdit ? 'Cập nhật giảm giá' : 'Tạo mới mục giảm giá'}
        </Typography>

        <Box>
          <form id="form" onSubmit={handleSubmit(submitForm)}>
            <Stack direction="column" spacing={3}>
              <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                {isEdit && (
                  <TextField
                    label="Id"
                    name="id"
                    fullWidth
                    value={watch('id')}
                    required
                    disabled
                    inputProps={{ sx: fontSize }}
                    InputLabelProps={{ sx: fontSize }}
                  />
                )}
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tên khuyến mãi"
                      name="name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      required
                      inputProps={{ sx: fontSize }}
                      InputLabelProps={{ sx: fontSize }}
                    />
                  )}
                />
              </Stack>

              <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                <Controller
                  name="discount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phần trăm giảm giá"
                      name="discount"
                      type="number"
                      fullWidth
                      error={!!errors.discount}
                      helperText={errors.discount?.message}
                      required
                      inputProps={{ sx: fontSize }}
                      InputLabelProps={{ sx: fontSize }}
                    />
                  )}
                />
                <FormControl fullWidth>
                  <InputLabel sx={fontSize} id="discount-promotion">
                    Trạng thái
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
                        label="Trạng thái"
                        error={!!errors.status}
                        sx={fontSize}
                      >
                        {defaultStatusValues.map((item, index) => (
                          <MenuItem sx={fontSize} key={`${item}-${index}`} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {!!errors.status && (
                    <FormHelperText sx={fontSize} error>
                      {errors.status?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              <Stack direction={mdUp ? 'row' : 'column'} spacing={2} justifyContent="space-between">
                <Controller
                  name="from_day"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DemoContainer components={['DatePicker']} sx={{ flex: 1 }}>
                        <StyledDatePicker
                          {...field}
                          sx={{ width: '100%' }}
                          label="Ngày bắt đầu"
                          name="from_day"
                          required
                        />
                      </DemoContainer>
                      {!!errors.from_day && (
                        <FormHelperText error sx={fontSize}>
                          {errors.from_day?.message}
                        </FormHelperText>
                      )}
                    </LocalizationProvider>
                  )}
                />
                <Controller
                  name="to_day"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DemoContainer components={['DatePicker']} sx={{ flex: 1 }}>
                        <StyledDatePicker
                          {...field}
                          sx={{ width: '100%' }}
                          label="Ngày kết thúc"
                          name="to_day"
                          required
                        />
                      </DemoContainer>
                      {!!errors.to_day && (
                        <FormHelperText error sx={{ margin: '3px 14px 0', fontSize }}>
                          {errors.to_day?.message}
                        </FormHelperText>
                      )}
                    </LocalizationProvider>
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={2} justifyContent={mdUp ? 'start' : 'space-between'}>
                <CustomButton
                  colors={primary.primary}
                  type="submit"
                  disabled={
                    !isEdit ? isSubmitting || !isValid : (isEdit && !isDirty) || isSubmitting
                  }
                >
                  {isEdit ? 'Cập nhật' : 'Tạo mới'}
                </CustomButton>
                <CustomButton colors={info.main} type="button" onClick={handleClose}>
                  Hủy bỏ
                </CustomButton>
              </Stack>
            </Stack>
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

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: 13,
  },
  '& .MuiFormLabel-root': {
    fontSize: 13,
  },
}));
