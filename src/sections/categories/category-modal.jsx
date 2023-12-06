import {
  Box,
  Button,
  Container,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
  createTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { notify } from 'src/utils/untils';
import { CategoryService } from 'src/apis/category-service';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components';
import { useResponsive } from 'src/hooks/use-responsive';
import { primary } from 'src/theme/palette';
import { BorderClearRounded } from '@mui/icons-material';
import { CustomButton } from 'src/theme/styled';

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
};

const schema = Yup.object()
  .shape({
    name: Yup.string().required('Vui lòng nhập tên'),
    description: Yup.string().required('Vui lòng nhập mô tả'),
  })
  .required();

export default function CategoryModal({ open, handleClose }) {
  const { user } = useSelector((x) => x.rootReducer.user);
  const mdUp = useResponsive('up', 'md');
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    setValue('created_by', user.full_name);
  }, []);

  const onSubmitForm = async (value) => {
    const {
      data: { message },
      status,
    } = await CategoryService.CreateCategory({ ...value, created_by: user.full_name });
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
          Thêm mới danh mục
        </Typography>
        <Box>
          <FormAdd id="form" onSubmit={handleSubmit(onSubmitForm)}>
            <Stack direction="column" spacing={2}>
              <Stack direction={mdUp ? 'row' : 'column'} spacing={3} width={1}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      size="medium"
                      required
                      fullWidth
                      label="Tên"
                      name="name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      inputProps={{ sx: { fontSize } }}
                      InputLabelProps={{ sx: fontSize }}
                    />
                  )}
                />
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      size="medium"
                      required
                      fullWidth
                      label="Mô tả"
                      name="description"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      inputProps={{ sx: fontSize }}
                      InputLabelProps={{ sx: fontSize }}
                    />
                  )}
                />
              </Stack>
              <Stack maxWidth={100}>
                <CustomButton
                  variant="contained"
                  colors={primary.primary}
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >
                  Tạo mới
                </CustomButton>
              </Stack>
            </Stack>
          </FormAdd>
        </Box>
      </Container>
    </Modal>
  );
}

CategoryModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

const FormAdd = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
