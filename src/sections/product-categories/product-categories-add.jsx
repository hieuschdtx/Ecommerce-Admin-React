import {
  Box,
  Button,
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
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';
import { notify } from 'src/utils/untils';
import { useSelector } from 'react-redux';
import { productCategoriesService } from 'src/apis/product-categories-service';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { useResponsive } from 'src/hooks/use-responsive';
import { CustomButton } from 'src/theme/styled';
import { primary } from 'src/theme/palette';

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
  width: '50%',
};

const defaultValues = {
  name: '',
  description: '',
  created_by: '',
  category_id: '',
  promotion_id: '',
};

const schema = Yup.object()
  .shape({
    name: Yup.string().required('Vui lòng nhập tên'),
    description: Yup.string().required('Vui lòng nhập mô tả'),
    category_id: Yup.string().required('Vui lòng chọn giá trị'),
    promotion_id: Yup.string().required('Vui lòng chọn giá trị'),
  })
  .required();

export default function ProductCategoriesAdd({ open, handleClose }) {
  const { promotion } = useSelector((state) => state.rootReducer.promotions);
  const { categories } = useSelector((state) => state.rootReducer.category);
  const { user } = useSelector((x) => x.rootReducer.user);
  const mdUp = useResponsive('up', 'md');

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmitFormAdd = async (value) => {
    const param = { ...value, created_by: user.full_name };
    const {
      data: { message },
      status,
    } = await productCategoriesService.createProductCategory(param);
    notify(message, status);
    reset(defaultValues);
  };

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
          Thêm mới danh mục sản phẩm
        </Typography>
        <Box>
          <FormAdd onSubmit={handleSubmit(onSubmitFormAdd)}>
            <Stack direction="column" spacing={3}>
              <Stack direction={mdUp ? 'row' : 'column'}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tên danh mục sản phẩm"
                      name="name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      required
                      inputProps={{ sx: { fontSize } }}
                      InputLabelProps={{ sx: fontSize }}
                    />
                  )}
                />
              </Stack>
              <Stack direction={mdUp ? 'row' : 'column'}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Mô tả"
                      multiline
                      minRows={3}
                      name="description"
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      required
                      inputProps={{ sx: { fontSize } }}
                      InputLabelProps={{ sx: fontSize }}
                    />
                  )}
                />
              </Stack>
              <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel sx={fontSize} id="promotion-select">
                    Khuyến mãi
                  </InputLabel>
                  <Controller
                    name="promotion_id"
                    control={control}
                    render={({ field }) => (
                      <Tooltip title="Chọn phầm trăm giảm giá">
                        <Select
                          {...field}
                          labelId="promotion-select"
                          name="promotion_id"
                          id="promotion-select"
                          label="Khuyến mãi"
                          error={!!errors.promotion_id}
                          sx={fontSize}
                        >
                          {promotion?.map((item, index) => (
                            <MenuItem sx={fontSize} key={`${item}-${index}`} value={item.id}>
                              {item.discount}
                            </MenuItem>
                          ))}
                        </Select>
                      </Tooltip>
                    )}
                  />
                  {!!errors.promotion_id && (
                    <FormHelperText error>{errors.promotion_id?.message}</FormHelperText>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={fontSize} id="category_select">
                    Danh mục
                  </InputLabel>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <Tooltip title="Chọn danh mục hiển thị">
                        <Select
                          {...field}
                          labelId="category_select"
                          name="category_id"
                          id="category-select"
                          label="Danh mục"
                          error={!!errors.category_id}
                          sx={fontSize}
                        >
                          {categories.map((item, index) => (
                            <MenuItem sx={fontSize} key={`${item}-${index}`} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Tooltip>
                    )}
                  />
                  {!!errors.category_id && (
                    <FormHelperText error>{errors.category_id?.message}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
              <Stack direction="row">
                <CustomButton
                  variant="contained"
                  colors={primary.primary}
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  Thêm mới
                </CustomButton>
              </Stack>
            </Stack>
          </FormAdd>
        </Box>
      </Container>
    </Modal>
  );
}

ProductCategoriesAdd.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

const FormAdd = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
