import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { productActionThunk } from 'src/redux/actions/product-action';
import { productCategoriesActionThunk } from 'src/redux/actions/product-categories-action';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { NumericFormat } from 'react-number-format';
import { productService } from 'src/apis/product-service';
import { notify } from 'src/utils/untils';
import { auth } from 'src/utils/auth';

const editorConfig = {
  enterMode: 'CKEditor5.EnterMode.PARAGRAPH',
  autoGrow: true,
  placeholder: 'Nhập nội dung chi tiết về sản phẩm...',
};

const styleLabel = {
  style: {
    fontSize: '13px',
  },
};

const defaultValues = {
  name: '',
  description: '',
  detail: '',
  avatar_file: null,
  thumbnails_file: [],
  price: 0,
  weight: 0,
  status: true,
  home_flag: true,
  hot_flag: false,
  stock: 0,
  created_by: '',
  product_category_id: '',
  origin: 'Việt Nam',
  storage: '',
};

const schema = Yup.object().shape({
  name: Yup.string().required('Tên sản phẩm không được để trống'),
  price: Yup.string().required('Vui lòng nhập giá sản phẩm').min(0, 'Giá không được bé hơn 0'),
  weight: Yup.string()
    .required('Vui lòng nhập khối lượng')
    .min(0, 'Khối lượng không được bé hơn 0'),
  stock: Yup.number().required('Vui lòng nhập số lượng').min(0, 'Số lượng không được bé hơn 0'),
  product_category_id: Yup.string().required('Vui lòng chọn danh mục hiển thị'),
});

export default function ProductAdd() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const { productCategories } = useSelector((state) => state.rootReducer.productCategories);
  // const { products, productPrices } = useSelector((state) => state.rootReducer.products);
  const fileInputAvatarRef = useRef(null);
  const fileInputThumbRef = useRef(null);

  const {
    values,
    // setValues,
    resetForm,
    setFieldValue,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
  } = useFormik({
    initialValues: defaultValues,
    validationSchema: schema,
    onSubmit: async (value) => {
      console.log('Dữ liệu đã hợp lệ', value);
      const formData = new FormData();
      const {
        name,
        description,
        weight,
        price,
        detail,
        avatar_file,
        status,
        stock,
        home_flag,
        hot_flag,
        product_category_id,
        storage,
        created_by,
        origin,
      } = value;
      Object.entries({
        name,
        description,
        weight,
        price,
        detail,
        avatar_file,
        status,
        stock,
        home_flag,
        hot_flag,
        product_category_id,
        storage,
        created_by,
        origin,
      }).forEach(([key, item]) => formData.append(key, item));
      value.thumbnails_file.map((item) => formData.append('thumbnails_file', item));

      handleSubmitForm(formData);
    },
  });

  useEffect(() => {
    dispatch(productActionThunk.getProductPrices());
  }, [dispatch]);
  useEffect(() => {
    dispatch(productCategoriesActionThunk.getproductCategories());
  }, [dispatch]);
  useEffect(() => {
    dispatch(productActionThunk.getProduct());
  }, [dispatch]);

  useEffect(() => {
    const userData = auth.GetUserInfo();
    const { full_name } = userData;
    setFieldValue('created_by', full_name);
  }, [setFieldValue]);

  const handleFileChanges = (event) => {
    const file = event.target.files[0];
    setFieldValue('avatar_file', file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileThumbChanges = (event) => {
    const { files } = event.target;

    [...files].forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setSelectedThumbnail((prev) => [...prev, imageDataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const uploadedFiles = [];
    selectedThumbnail.forEach((imageDataUrl, index) => {
      fetch(imageDataUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const fileExtension = selectedThumbnail[index].split(';')[0].split('/')[1];
          const fileName = `${values.name}-${Math.random()
            .toString(36)
            .substring(2, 7)}-${Date.now()}.${fileExtension}`;
          const file = new File([blob], fileName, { type: blob.type });
          uploadedFiles.push(file);

          if (uploadedFiles.length === selectedThumbnail.length) {
            setFieldValue('thumbnails_file', uploadedFiles);
          }
        });
    });
  }, [selectedThumbnail, setFieldValue, values.name]);

  const handleDeleteImageUpload = (index) => {
    const updatedSelectedThumbnail = selectedThumbnail.filter((item, i) => i !== index);
    setSelectedThumbnail(updatedSelectedThumbnail);
  };

  const handleSubmitForm = async (body) => {
    const { data, status } = await productService.CreateNewProduct(body);
    const { message } = data;
    notify(message, status);
    resetForm();
    setSelectedAvatar(null);
    setSelectedThumbnail([]);
  };

  return (
    <Container>
      <Typography variant="h4">Thêm mới sản phẩm</Typography>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        spacing={1}
        sx={{ padding: 6 }}
      >
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            maxHeight: '250px',
          }}
        >
          <Grid
            item
            xs={12}
            display="flex"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
          >
            <Box
              sx={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: '50%',
                width: '150px',
                height: '150px',
                border: '1px solid #ccc',
              }}
            >
              <input
                id="avatar_file"
                name="avatar_file"
                type="file"
                ref={fileInputAvatarRef}
                style={{ display: 'none' }}
                onChange={handleFileChanges}
              />
              <img
                src={selectedAvatar}
                alt=""
                style={{
                  borderRadius: '50%',
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                }}
              />
              <Button
                type="button"
                variant="contained"
                sx={{
                  position: 'absolute',
                  backgroundColor: `${selectedAvatar ? 'transparent' : '#d3d4d5'}`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  width: '150px',
                  height: '150px',
                  fontSize: 64,
                  '&:hover': {
                    backgroundColor: '#d3d4d5',
                    opacity: 0.8,
                  },
                }}
                onClick={() => fileInputAvatarRef.current.click()}
              >
                {selectedAvatar ? ' ' : <i className="bi bi-camera-fill" />}
              </Button>
            </Box>
          </Grid>
          <Typography sx={{ textAlign: 'center', fontSize: '12px' }}>
            Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
          </Typography>
        </Grid>
        <Grid
          container
          item
          direction="row"
          xs={12}
          md={8}
          sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #f5f5f5',
          }}
        >
          <div style={{ width: '100%' }}>
            <form id="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">Thông tin sản phẩm</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="name"
                    autoComplete="off"
                    label="Tên sản phẩm"
                    name="name"
                    fullWidth
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    required
                    InputLabelProps={styleLabel}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="productCategory-select-label" sx={{ fontSize: '12px' }}>
                      Danh mục sản phẩm
                    </InputLabel>
                    <Select
                      labelId="productCategory-select-label"
                      label="Danh mục sản phẩm"
                      name="product_category_id"
                      id="category-select"
                      value={values.product_category_id}
                      onChange={handleChange}
                      error={touched.product_category_id && !!errors.product_category_id}
                      required
                    >
                      {productCategories.map((item, index) => (
                        <MenuItem key={`${item}-${index}`} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.product_category_id && errors.product_category_id && (
                      <FormHelperText error>{errors.product_category_id}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Mô tả"
                    name="description"
                    multiline
                    placeholder="Thông tin mô tả sản phẩm..."
                    rows={5}
                    fullWidth
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                    InputLabelProps={styleLabel}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <CKEditor
                    id="detail"
                    name="detail"
                    editor={ClassicEditor}
                    config={editorConfig}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setFieldValue('detail', data);
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <Typography variant="body1" fontWeight={700} textAlign="left">
                    Hình ảnh
                  </Typography>
                  <FormControl fullWidth>
                    <StyleUpLoadImage onClick={() => fileInputThumbRef.current.click()}>
                      <input
                        accept="image/*"
                        type="file"
                        multiple
                        ref={fileInputThumbRef}
                        id="thumbnails_file"
                        name="thumbnails_file"
                        onChange={handleFileThumbChanges}
                        style={{ display: 'none' }}
                      />
                      <Stack sx={{ height: '200px' }} direction="column" gap="24px">
                        <ImageUpload />
                        <Stack>
                          <Typography variant="h6" textAlign="center">
                            Drop or Select file
                          </Typography>
                          <Typography variant="normal" textAlign="center" color="gray">
                            Drop files here or click browse thorough your machine
                          </Typography>
                        </Stack>
                      </Stack>
                    </StyleUpLoadImage>
                    <Box margin="24px 0">
                      {selectedThumbnail.length > 0 &&
                        selectedThumbnail.map((item, index) => (
                          <StyleListImage key={index}>
                            <Stack
                              direction="row"
                              flexShrink={0}
                              alignItems="center"
                              justifyContent="center"
                              gap="24px"
                            >
                              <img
                                src={item}
                                alt={index}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  position: 'absolute',
                                }}
                              />
                            </Stack>
                            <ButtonDeleteImage
                              type="button"
                              onClick={() => handleDeleteImageUpload(index)}
                            >
                              <Iconify icon="mingcute:close-fill" width={10} />
                            </ButtonDeleteImage>
                          </StyleListImage>
                        ))}
                      {selectedThumbnail.length > 0 && (
                        <Stack direction="row" justifyContent="flex-end" alignItems="center">
                          <StyleRemoveButton type="button" onClick={() => setSelectedThumbnail([])}>
                            Remove all
                          </StyleRemoveButton>
                        </Stack>
                      )}
                    </Box>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Số lượng"
                    type="number"
                    name="stock"
                    fullWidth
                    value={values.stock}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.stock && !!errors.stock}
                    helperText={touched.stock && errors.stock}
                    required
                    InputLabelProps={styleLabel}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Xuất xứ"
                    name="origin"
                    disabled
                    fullWidth
                    value={values.origin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.origin && !!errors.origin}
                    helperText={touched.origin && errors.origin}
                    InputLabelProps={styleLabel}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Bảo quản"
                    name="storage"
                    multiline
                    placeholder="Thông tin cách bảo quản..."
                    rows={5}
                    fullWidth
                    value={values.storage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.storage && !!errors.storage}
                    helperText={touched.storage && errors.storage}
                    InputLabelProps={styleLabel}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Stack direction="row" gap={2}>
                    <NumericFormat
                      label="Giá gốc"
                      name="price"
                      customInput={TextField}
                      fullWidth
                      thousandSeparator
                      allowNegative={false}
                      decimalScale={2}
                      value={values.price}
                      onValueChange={({ floatValue }) => {
                        setFieldValue('price', floatValue);
                      }}
                      onBlur={handleBlur}
                      error={touched.price && !!errors.price}
                      helperText={touched.price && errors.price}
                      required
                      InputLabelProps={styleLabel}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <img src="/assets/images/covers/money.png" alt="" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <NumericFormat
                      label="Khối lượng tịnh"
                      name="weight"
                      customInput={TextField}
                      fullWidth
                      thousandSeparator
                      allowNegative={false}
                      decimalScale={2}
                      value={values.weight}
                      onValueChange={({ floatValue }) => {
                        setFieldValue('weight', floatValue);
                      }}
                      onBlur={handleBlur}
                      error={touched.weight && !!errors.weight}
                      helperText={touched.weight && errors.weight}
                      required
                      InputLabelProps={styleLabel}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <img src="/assets/images/covers/kg.png" alt="" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Stack>
                    <Typography variant="body1" fontWeight={700} textAlign="left">
                      Trạng thái sản phẩm
                    </Typography>
                    <FormControl component="fieldset" fullWidth>
                      <FormGroup name="gender" defaultValue="false" row>
                        <FormControlLabel
                          id="status"
                          name="status"
                          value={values.status}
                          control={
                            <Checkbox checked={values.status} size="small" color="success" />
                          }
                          onBlur={handleBlur}
                          label={<span style={{ fontSize: '12px' }}>Hiển thị</span>}
                          onChange={handleChange}
                        />
                        <FormControlLabel
                          id="home_flag"
                          name="home_flag"
                          value={values.home_flag}
                          control={
                            <Checkbox checked={values.home_flag} size="small" color="success" />
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label={<span style={{ fontSize: '12px' }}>Trang chủ</span>}
                        />
                        <FormControlLabel
                          id="hot_flag"
                          name="hot_flag"
                          value={values.hot_flag}
                          control={
                            <Checkbox checked={values.hot_flag} size="small" color="success" />
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={<span style={{ fontSize: '12px' }}>Sản phẩm nổi bật</span>}
                        />
                      </FormGroup>
                    </FormControl>
                  </Stack>
                </Grid>

                <Grid
                  item
                  xs={12}
                  container
                  direction="row"
                  gap={2}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    variant="outlined"
                    color="inherit"
                    type="button"
                    onClick={() => router.push('/products')}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    sx={{ backgroundColor: 'black' }}
                    type="submit"
                  >
                    Thêm mới
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

const StyleUpLoadImage = styled.div`
  padding: 40px;
  outline: none;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background-color: #919eab14;
  border: 1px dashed rgba(145, 158, 171, 0.2);
  transition:
    opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    padding 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    opacity: 0.7;
  }
`;

const ImageUpload = styled.div`
  background-image: url('/assets/illustrations/illustrations_upload.svg');
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
`;

const StyleListImage = styled.div`
  opacity: 1;
  transform: none;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
  margin: 4px;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(145, 158, 171, 0.16);
`;

const ButtonDeleteImage = styled.button`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  text-align: center;
  flex: 0 0 auto;
  border-radius: 50%;
  overflow: visible;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-size: 1.125rem;
  padding: 4px;
  top: 4px;
  right: 4px;
  position: absolute;
  color: rgb(255, 255, 255);
  background-color: rgba(22, 28, 36, 0.48);
  &:hover {
    background-color: rgba(22, 28, 36, 0.72);
  }
`;

const StyleRemoveButton = styled.button`
  padding: 7px 7px;
  border-radius: 8px;
  outline: none;
  border: 1px solid #d9d7d7;
  background-color: white;
  color: black;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    border: 1px solid black;
  }
`;
