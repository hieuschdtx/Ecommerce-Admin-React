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
  Paper,
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
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { fDateTime } from 'src/utils/format-time';
import { productCategoriesService } from 'src/apis/product-categories-service';
import { notify } from 'src/utils/untils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 'none',
  borderRadius: '24px',
  p: 3,
  width: '45%',
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
};

const defaultValues = {
  id: '',
  name: '',
  description: '',
  created_by: '',
  created_at: new Date(),
  modified_by: '',
  modified_at: new Date(),
  category_id: '',
  promotion_id: '',
};

const validationForm = Yup.object({
  id: Yup.string().required(''),
  created_by: Yup.string().required(''),
  created_at: Yup.string().required(''),
  modified_by: Yup.string().required(''),
  modified_at: Yup.string().required(''),
  name: Yup.string().required('Vui lòng nhập tên'),
  description: Yup.string().required('Vui lòng nhập mô tả'),
  category_id: Yup.string().required('Vui lòng chọn giá trị'),
  promotion_id: Yup.string().required('Vui lòng chọn giá trị'),
});

export default function ProductCategoriesEdit({ open, handleClose, proCategory }) {
  const [fullName, setFullName] = useState(null);
  const { promotion } = useSelector((state) => state.rootReducer.promotions);
  const { categories } = useSelector((state) => state.rootReducer.category);
  const { productCategories } = useSelector((state) => state.rootReducer.productCategories);

  const { values, dirty, resetForm, handleChange, handleBlur, errors, isSubmitting, touched } =
    useFormik({
      initialValues: defaultValues,
      validationSchema: validationForm,
    });

  const filterProductCategory = useMemo(
    () => productCategories?.find((item) => item.id === proCategory),
    [proCategory, productCategories]
  );

  useEffect(() => {
    if (filterProductCategory) {
      const val = { ...defaultValues, ...filterProductCategory };
      resetForm({ values: val, dirty: false });
    }
  }, [filterProductCategory]);

  useEffect(() => {
    const userData = auth.GetUserInfo();
    const { full_name } = userData;
    setFullName(full_name);
  }, [fullName]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const body = {
      name: values.name,
      description: values.description,
      modified_by: fullName,
      promotion_id: values.promotion_id,
      category_id: values.category_id,
    };
    const { data, status } = await productCategoriesService.updateProductCategory(values.id, body);
    const { message } = data;
    notify(message, status);
    resetForm();
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
            Edit Product category
          </Typography>
          <Box>
            <form id="form" onSubmit={(e) => handleSubmitForm(e)}>
              <Grid direction="row" container spacing={2}>
                <Grid item xs={12} sm={7}>
                  <TextField
                    label="Id"
                    name="id"
                    fullWidth
                    disabled
                    value={values.id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.id && !!errors.id}
                    helperText={touched.id && errors.id}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={8}
                    fullWidth
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
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
                        value={values.category_id}
                        label="Category"
                        onChange={handleChange}
                        error={touched.category_id && !!errors.category_id}
                      >
                        {categories.map((item, index) => (
                          <MenuItem key={`${item}-${index}`} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Tooltip>
                    {touched.category_id && errors.category_id && (
                      <FormHelperText error>{errors.category_id}</FormHelperText>
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
                        value={values.promotion_id}
                        label="Promotion"
                        onChange={handleChange}
                        error={touched.promotion_id && !!errors.promotion_id}
                      >
                        {promotion.map((item, index) => (
                          <MenuItem key={`${item}-${index}`} value={item.id}>
                            {item.discount}
                          </MenuItem>
                        ))}
                      </Select>
                    </Tooltip>
                    {touched.promotion_id && errors.promotion_id && (
                      <FormHelperText error>{errors.promotion_id}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Created by"
                    name="created_by"
                    fullWidth
                    disabled
                    value={values.created_by}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.created_by && !!errors.created_by}
                    helperText={touched.created_by && errors.created_by}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Created at"
                    name="created_at"
                    fullWidth
                    disabled
                    value={fDateTime(values.created_at)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.created_at && !!errors.created_at}
                    helperText={touched.created_at && errors.created_at}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Modified by"
                    name="modified_by"
                    fullWidth
                    disabled
                    value={values.modified_by || 'null'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.modified_by && !!errors.modified_by}
                    helperText={touched.modified_by && errors.modified_by}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Modified at"
                    name="modified_at"
                    fullWidth
                    disabled
                    value={fDateTime(values.modified_at) || 'null'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.modified_at && !!errors.modified_at}
                    helperText={touched.modified_at && errors.modified_at}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6} textAlign="start">
                  <Button
                    variant="contained"
                    color="error"
                    type="submit"
                    disabled={!dirty || isSubmitting}
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} textAlign="end">
                  <Button variant="contained" color="info" type="button" onClick={handleClose}>
                    Cancle
                  </Button>
                </Grid>
              </Grid>
            </form>
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
