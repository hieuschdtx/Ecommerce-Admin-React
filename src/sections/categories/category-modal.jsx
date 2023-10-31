import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';
import { auth } from 'src/utils/auth';
import { useEffect, useState } from 'react';
import { notify } from 'src/utils/untils';
import { CategoryService } from 'src/apis/category-service';

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

export default function CategoryModal({ open, handleClose }) {
  const [fullName, setFullName] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      created_by: '',
    },
    validationSchema: validationForm,
    onSubmit: async (values, { resetForm }) => {
      handleClose();
      values.created_by = fullName;
      const data = await CategoryService.CreateCategory(values);
      const { message, success } = data;
      notify(message, success);
      resetForm();
    },
  });

  useEffect(() => {
    const userData = auth.GetUserInfo();
    const { full_name } = userData;
    setFullName(full_name);
  }, [fullName]);

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
          Create new Category
        </Typography>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Grid direction="row" container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && !!formik.errors.name}
                  helperText={formik.touched.name && formik.errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.description && !!formik.errors.description}
                  helperText={formik.touched.description && formik.errors.description}
                  required
                />
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

CategoryModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

const validationForm = Yup.object({
  name: Yup.string().required('Vui lòng nhập tên'),
  description: Yup.string().required('Vui lòng nhập mô tả'),
});
