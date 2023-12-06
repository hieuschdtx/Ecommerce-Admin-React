import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { fDateTime } from 'src/utils/format-time';
import { productCategoriesService } from 'src/apis/product-categories-service';
import { notify } from 'src/utils/untils';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
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
  borderRadius: '24px',
  p: 3,
  width: '50%',
  overflowY: 'scroll hidden',
  height: '60vh',
  outline: 'none',
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

const defaultValues = {
  name: '',
  description: '',
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

export default function ProductCategoriesEdit({ open, handleClose, proCategory }) {
  const { promotion } = useSelector((state) => state.rootReducer.promotions);
  const { categories } = useSelector((state) => state.rootReducer.category);
  const { productCategories } = useSelector((state) => state.rootReducer.productCategories);
  const { user } = useSelector((x) => x.rootReducer.user);
  const mdUp = useResponsive('up', 'md');

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const filterProductCategory = useMemo(
    () => productCategories?.find((item) => item.id === proCategory),
    [proCategory, productCategories]
  );

  useEffect(() => {
    if (filterProductCategory) {
      const val = { ...defaultValues, ...filterProductCategory };
      console.log(val);
      reset(val);
    }
  }, [filterProductCategory]);

  const handleSubmitForm = async (value) => {
    const {
      data: { message },
      status,
    } = await productCategoriesService.updateProductCategory({
      ...value,
      modified_by: user.full_name,
    });
    notify(message, status);
    reset(defaultValues);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ overflow: 'auto' }}
    >
      <Container sx={style}>
        <Paper sx={stylePaper}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 4, right: 4 }}>
            <Iconify icon="iconamoon:close" width={24} height={24} />
          </IconButton>
          <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
            Chỉnh sửa danh mục sản phẩm
          </Typography>
          <Box>
            <FormEdit id="form" onSubmit={handleSubmit(handleSubmitForm)}>
              <Stack direction="column" spacing={3} width={1}>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="id"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Id"
                        name="id"
                        fullWidth
                        disabled
                        inputProps={{ sx: { fontSize } }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tên danh mục sản phẩm"
                        name="name"
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name?.message}
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
                        name="description"
                        multiline
                        minRows={3}
                        fullWidth
                        required
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        inputProps={{ sx: { fontSize } }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
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
                      <FormHelperText sx={fontSize} error>
                        {errors.category_id?.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel sx={fontSize} id="promotion_select">
                      Khuyến mãi
                    </InputLabel>
                    <Controller
                      name="promotion_id"
                      control={control}
                      render={({ field }) => (
                        <Tooltip title="Chọn phầm trăm giảm giá">
                          <Select
                            {...field}
                            labelId="promotion_select"
                            name="promotion_id"
                            id="promotion-select"
                            label="Khuyến mãi"
                            error={!!errors.promotion_id}
                            sx={fontSize}
                          >
                            {promotion.map((item, index) => (
                              <MenuItem sx={fontSize} key={`${item}-${index}`} value={item.id}>
                                {item.discount}
                              </MenuItem>
                            ))}
                          </Select>
                        </Tooltip>
                      )}
                    />
                    {!!errors.promotion_id && (
                      <FormHelperText sx={fontSize} error>
                        {errors.promotion_id?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="created_by"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Người tạo"
                        name="created_by"
                        fullWidth
                        disabled
                        inputProps={{ sx: { fontSize } }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                  <Controller
                    name="created_at"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        name="created_at"
                        value={fDateTime(watch('created_at'))}
                        label="Ngày tạo"
                        fullWidth
                        disabled
                        inputProps={{ sx: { fontSize } }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="modified_by"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        name="modified_by"
                        label="Người chỉnh sửa"
                        fullWidth
                        disabled
                        inputProps={{ sx: { fontSize } }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                  <Controller
                    name="modified_at"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        name="modified_at"
                        label="Ngày chỉnh sửa"
                        value={fDateTime(watch('modified_at')) || ''}
                        fullWidth
                        disabled
                        inputProps={{ sx: { fontSize } }}
                        InputLabelProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>
                <Stack
                  direction="row"
                  textAlign="left"
                  spacing={2}
                  justifyContent={mdUp ? 'flex-start' : 'space-between'}
                >
                  <CustomButton
                    type="submit"
                    colors={primary.primary}
                    disabled={!isValid || isSubmitting || !isDirty}
                  >
                    Cập nhật
                  </CustomButton>
                  <CustomButton colors={info.main} type="button" onClick={handleClose}>
                    Trở lại
                  </CustomButton>
                </Stack>
              </Stack>
            </FormEdit>
          </Box>
        </Paper>
      </Container>
    </Modal>
  );
}

ProductCategoriesEdit.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  proCategory: PropTypes.string,
};

const FormEdit = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;
