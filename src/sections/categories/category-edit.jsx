import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { notify } from 'src/utils/untils';
import { CategoryService } from 'src/apis/category-service';
import { fDateTime } from 'src/utils/format-time';
import Iconify from '../../components/iconify';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResponsive } from 'src/hooks/use-responsive';
import styled from 'styled-components';

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
  width: '70%',
};

const defaultValues = {
  id: '',
  name: '',
  description: '',
  created_by: '',
  created_at: new Date(),
  modified_by: '',
  modified_at: new Date(),
};

const schema = Yup.object()
  .shape({
    name: Yup.string().required('Vui lòng nhập tên'),
    description: Yup.string().required('Vui lòng nhập mô tả'),
  })
  .required();

const CategoryEdit = ({ open, handleClose, categoryId }) => {
  const { categories } = useSelector((state) => state.rootReducer.category);
  const { user } = useSelector((x) => x.rootReducer.user);
  const mdUp = useResponsive('up', 'md');

  useEffect(() => {
    const val = categories.find((item) => item.id === categoryId);
    reset({ ...defaultValues, ...val });
  }, [categoryId, categories]);

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmitUpdate = async (value) => {
    console.log(value);
    const {
      data: { message },
      status,
    } = await CategoryService.UpdateCategory({ ...value, modified_by: user.full_name });

    notify(message, status);
    handleClose();
    reset({ ...defaultValues });
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
          Cập nhật danh mục
        </Typography>
        <Box>
          <FormEdit id="form" onSubmit={handleSubmit(onSubmitUpdate)}>
            <Stack direction="column" spacing={3}>
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
                      label="Tên danh mục"
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
                      label="Mô tả danh mục"
                      name="description"
                      multiline
                      minRows={3}
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
                      value={watch('modified_by') || 'null'}
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
                      value={fDateTime(watch('modified_at')) || 'null'}
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
                <Button
                  variant="contained"
                  color="error"
                  type="submit"
                  disabled={!isValid || isSubmitting || !isDirty}
                >
                  Cập nhật
                </Button>
                <Button variant="contained" color="info" type="button" onClick={handleClose}>
                  Trở lại
                </Button>
              </Stack>
            </Stack>
          </FormEdit>
        </Box>
      </Container>
    </Modal>
  );
};

export default CategoryEdit;

CategoryEdit.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  categoryId: PropTypes.string,
};

const FormEdit = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
