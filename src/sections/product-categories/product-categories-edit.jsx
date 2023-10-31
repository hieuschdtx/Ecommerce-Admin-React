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
  Tooltip,
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
import { useSelector } from 'react-redux';

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

export default function ProductCategoriesEdit({ open, handleClose }) {
  const [fullName, setFullName] = useState(null);
  const { promotion } = useSelector((state) => state.rootReducer.promotions);
  const { categories } = useSelector((state) => state.rootReducer.category);
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      created_by: '',
      category_id: '',
      promotion_id: '',
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
          Create new Product category
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Category</InputLabel>
                  <Tooltip title="Chọn danh mục hiển thị">
                    <Select
                      labelId="role-select-label"
                      name="category_id"
                      id="category-select"
                      value={formik.values.category_id}
                      label="Category"
                      onChange={formik.handleChange}
                      error={formik.touched.category_id && !!formik.errors.category_id}
                    >
                      {categories.map((item, index) => (
                        <MenuItem key={`${item}-${index}`} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Tooltip>
                  {formik.touched.category_id && formik.errors.category_id && (
                    <FormHelperText error>{formik.errors.category_id}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Promotion</InputLabel>
                  <Tooltip title="Chọn phầm trăm giảm giá">
                    <Select
                      labelId="role-select-label"
                      name="promotion_id"
                      id="promotion-select"
                      value={formik.values.promotion_id}
                      label="Promotion"
                      onChange={formik.handleChange}
                      error={formik.touched.promotion_id && !!formik.errors.promotion_id}
                    >
                      {promotion.map((item, index) => (
                        <MenuItem key={`${item}-${index}`} value={item.id}>
                          {item.discount}
                        </MenuItem>
                      ))}
                    </Select>
                  </Tooltip>
                  {formik.touched.promotion_id && formik.errors.promotion_id && (
                    <FormHelperText error>{formik.errors.promotion_id}</FormHelperText>
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

ProductCategoriesEdit.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

const validationForm = Yup.object({
  name: Yup.string().required('Vui lòng nhập tên'),
  description: Yup.string().required('Vui lòng nhập mô tả'),
  category_id: Yup.string().required('Vui lòng chọn giá trị'),
  promotion_id: Yup.string().required('Vui lòng chọn giá trị'),
});
