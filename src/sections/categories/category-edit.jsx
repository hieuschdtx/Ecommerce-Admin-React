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
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useMemo, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { notify } from 'src/utils/untils';
import { CategoryService } from 'src/apis/category-service';
import { auth } from 'src/utils/auth';
import { fDateTime } from 'src/utils/format-time';
import Iconify from '../../components/iconify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '16px',
  p: 3,
  width: '45%',
};

const CategoryEdit = ({ open, handleClose, categoryId }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [fullName, setFullName] = useState(null);

  const { categories } = useSelector((state) => state.rootReducer.category);
  const categoryById = useMemo(
    () => categories.find((item) => item.id === categoryId),
    [categoryId, categories]
  );

  const formik = useFormik({
    initialValues: {
      id: categoryById.id,
      name: categoryById.name,
      description: categoryById.description,
      created_by: categoryById.created_by,
      created_at: categoryById.created_at,
      modified_by: categoryById.modified_by,
      modified_at: categoryById.modified_at,
    },
    validationSchema: validationForm,
    onSubmit: async (values, { resetForm }) => {
      const body = {
        name: values.name,
        description: values.description,
        modified_by: fullName,
      };

      const { data, status } = await CategoryService.UpdateCategory(values.id, body);
      const { message } = data;
      notify(message, status);
      handleClose();
      resetForm();
    },
  });

  useEffect(() => {
    const { name, description } = formik.values;
    setIsDisabled(!(name !== categoryById.name || description !== categoryById.description));
  }, [categoryById.name, categoryById.description, formik.values]);

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
          Update Category
        </Typography>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Grid direction="row" container spacing={2}>
              <Grid item xs={12} sm={7}>
                <TextField
                  label="Id"
                  name="id"
                  fullWidth
                  value={formik.values.id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.id && !!formik.errors.id}
                  helperText={formik.touched.id && formik.errors.id}
                  disabled
                  required
                />
              </Grid>
              <Grid item xs={12} sm={5}>
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
              <Grid item xs={12} sm={12}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Created by"
                  name="created_by"
                  fullWidth
                  value={formik.values.created_by}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.created_by && !!formik.errors.created_by}
                  helperText={formik.touched.created_by && formik.errors.created_by}
                  disabled
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Created at"
                  name="created_at"
                  fullWidth
                  value={fDateTime(formik.values.created_at)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.created_at && !!formik.errors.created_at}
                  helperText={formik.touched.created_at && formik.errors.created_at}
                  disabled
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Modified by"
                  name="modified_by"
                  fullWidth
                  value={formik.values.modified_by || 'null'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.modified_by && !!formik.errors.modified_by}
                  helperText={formik.touched.modified_by && formik.errors.modified_by}
                  disabled
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Modified at"
                  name="modified_at"
                  fullWidth
                  value={fDateTime(formik.values.modified_at) || 'null'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.modified_at && !!formik.errors.modified_at}
                  helperText={formik.touched.modified_at && formik.errors.modified_at}
                  disabled
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
                <Button variant="contained" color="error" type="submit" disabled={isDisabled}>
                  Update
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                <Button variant="contained" color="info" type="button" onClick={handleClose}>
                  Cancle
                </Button>
              </Grid>
            </Grid>
          </form>
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

const validationForm = Yup.object({
  name: Yup.string().required('Vui lòng nhập tên'),
  description: Yup.string().required('Vui lòng nhập mô tả'),
});
