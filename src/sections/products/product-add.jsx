import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { memo, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { productActionThunk } from 'src/redux/actions/product-action';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styled from 'styled-components';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { NumericFormat } from 'react-number-format';
import { productService } from 'src/apis/product-service';
import { notify } from 'src/utils/untils';
import { useParams } from 'react-router-dom';
import { productCategoriesActionThunk } from 'src/redux/actions/product-categories-action';
import { connection } from 'src/utils/signalR';
import { useResponsive } from 'src/hooks/use-responsive';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomAvatar from 'src/components/avatar/avatar';

const editorConfig = {
  enterMode: 'CKEditor5.EnterMode.PARAGRAPH',
  autoGrow: true,
  placeholder: 'Nhập nội dung chi tiết về sản phẩm...',
};

const fontSize = {
  fontSize: 13,
};

const filePath = `${import.meta.env.VITE_BACKEND_URL}images/products`;

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

const schema = Yup.object()
  .shape({
    name: Yup.string().required('Tên sản phẩm không được để trống'),
    product_category_id: Yup.string().required('Vui lòng chọn danh mục hiển thị'),
    price: Yup.number()
      .typeError('Giá phải là số')
      .required('Vui lòng nhập giá sản phẩm')
      .min(0, 'Giá phải lớn hơn 0'),
    weight: Yup.number()
      .typeError('Khối lượng phải là số')
      .required('Vui lòng nhập khối lượng sản phẩm')
      .min(0, 'Khối lượng phải lớn hơn 0'),
    stock: Yup.number()
      .typeError('Số lượng phải là số')
      .required('Vui lòng nhập số lượng')
      .min(0, 'Số lượng phải lớn hơn 0'),
  })
  .required();

const ProductAdd = ({ isAdd }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState([]);
  const [updateImage, setUpdateImage] = useState([]);
  const [deleteImage, setdeleteImage] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const editorRef = useRef(null);
  const mdUp = useResponsive('up', 'md');

  const { user } = useSelector((x) => x.rootReducer.user);
  const { productCategories } = useSelector((state) => state.rootReducer.productCategories);
  const { getPriceById, getProductById } = useSelector((x) => x.rootReducer.products);

  const fileInputAvatarRef = useRef(null);
  const fileInputThumbRef = useRef(null);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const submitForm = async (value) => {
    const formData = new FormData();
    value.thumbnails_file.map((item) => formData.append('thumbnails_file', item));
    Object.entries({
      ...value,
      created_by: user.full_name,
    }).forEach(([key, item]) => formData.append(key, item));
    handleSubmitForm(formData);

    if (!isAdd) {
      if (value.thumbnails_file.length > 0) {
        await productService.UpdateImageProduct(formData);
      }
      if (value.price !== getPriceById.price || value.weight !== getPriceById.weight) {
        await productService.UpdatePriceProduct(formData);
      }
      if (deleteImage.length > 0) {
        deleteImage.map((item) => formData.append('files_name', item.file_name));
        await productService.DelteImageProduct(formData);
      }
    }
  };

  const handleSubmitForm = async (param) => {
    if (!isAdd) {
      const {
        data: { message },
        status,
      } = await productService.UpdateProduct(param);
      notify(message, status);
    } else {
      const {
        data: { message },
        status,
      } = await productService.CreateNewProduct(param);
      notify(message, status);
      reset(defaultValues);
      if (editorRef && editorRef.current && editorRef.current.editor) {
        editorRef.current.editor.setData('');
      }

      setSelectedAvatar(null);
      setSelectedThumbnail([]);
    }
  };

  useEffect(() => {
    dispatch(productCategoriesActionThunk.getproductCategories());
    if (!isAdd) {
      dispatch(productActionThunk.getProductById(id));
      dispatch(productActionThunk.getPriceByProductId(id));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAdd) {
      connection.on('RELOAD_DATA_CHANGE', () => {
        dispatch(productActionThunk.getProductById(id));
        dispatch(productActionThunk.getPriceByProductId(id));
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAdd) {
      const map = [];
      if (getProductById?.thumnails) {
        const thumbs = JSON.parse(getProductById.thumnails);
        thumbs.forEach((item) => {
          map.push(`${filePath}${item.file_name}`);
        });
      }
      setUpdateImage(map);
      setSelectedThumbnail(map);

      if (getProductById?.avatar) {
        setSelectedAvatar(`${filePath}${getProductById?.avatar}`);
      }
      const val = {
        ...defaultValues,
        ...getPriceById,
        ...getProductById,
      };
      reset(val);
    }
  }, [getPriceById, getProductById]);

  const handleFileChanges = (event) => {
    const file = event.target.files[0];
    setValue('avatar_file', file);

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
    Promise.all(
      selectedThumbnail.map((imageDataUrl, index) => {
        if (!updateImage.includes(imageDataUrl)) {
          return fetch(imageDataUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const fileExtension = selectedThumbnail[index].split(';')[0].split('/')[1];
              const fileName = `${watch('name')}-${Math.random()
                .toString(36)
                .substring(2, 7)}-${Date.now()}.${fileExtension}`;
              return new File([blob], fileName, { type: blob.type });
            });
        }
        return [];
      })
    ).then((uploadedFiles) => {
      const filteredFiles = uploadedFiles.filter((file) => file.length !== 0);
      setValue('thumbnails_file', filteredFiles);
    });
  }, [selectedThumbnail, watch('name')]);

  const handleDeleteImageUpload = (index) => {
    const regex = /products(.*)/;

    const updatedSelectedThumbnails = selectedThumbnail.filter((item, i) => i !== index);
    if (!isAdd) {
      const thumbs = JSON.parse(watch('thumnails'));
      const deleteFileThumbnail = selectedThumbnail[index];

      const deletedFile = thumbs.find(
        (img) => img.file_name === deleteFileThumbnail.match(regex)?.[1]
      );
      if (deletedFile) setdeleteImage((prev) => [...prev, deletedFile]);
    }
    setSelectedThumbnail(updatedSelectedThumbnails);
  };

  return (
    <Container>
      <Typography variant="h4">{isAdd ? 'Thêm mới sản phẩm' : 'Chỉnh sửa sản phẩm'}</Typography>
      <Stack direction={mdUp ? 'row' : 'column'} justifyContent="space-between" spacing={3} mt={2}>
        <CustomAvatar
          fileInputAvatarRef={fileInputAvatarRef}
          handleFileChanges={handleFileChanges}
          selectedAvatar={selectedAvatar}
        />
        <Stack
          sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #d2d2d3',
            flex: 2,
          }}
        >
          <Box width={1}>
            <form id="form" onSubmit={handleSubmit(submitForm)}>
              <Stack spacing={3} direction="column">
                <Stack>
                  <Typography variant="body1" fontWeight={700} textAlign="left">
                    Thông tin sản phẩm
                  </Typography>
                </Stack>
                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tên sản phẩm"
                        name="name"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        required
                        InputLabelProps={{ sx: fontSize }}
                        inputProps={{ sx: fontSize }}
                      />
                    )}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="productCategory-select-label" sx={fontSize}>
                      Danh mục sản phẩm
                    </InputLabel>
                    <Controller
                      name="product_category_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="productCategory-select-label"
                          label="Danh mục sản phẩm"
                          name="product_category_id"
                          id="category-select"
                          error={!!errors.product_category_id}
                          required
                          sx={fontSize}
                        >
                          {productCategories.map((item, index) => (
                            <MenuItem sx={fontSize} key={`${item}-${index}`} value={item.id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {!!errors.product_category_id && (
                      <FormHelperText sx={fontSize} error>
                        {errors.product_category_id?.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
                <Stack>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Mô tả"
                        name="description"
                        multiline
                        placeholder="Thông tin mô tả sản phẩm..."
                        minRows={5}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        InputLabelProps={{ sx: fontSize }}
                        inputProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>
                <Stack>
                  <CKEditor
                    id="detail"
                    name="detail"
                    data={isAdd ? '' : watch('detail')}
                    editor={ClassicEditor}
                    config={editorConfig}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setValue('detail', data);
                    }}
                    onReady={(editor) => {
                      editorRef.current = editor;
                    }}
                  />
                </Stack>

                <Stack direction="column" spacing={2}>
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
                          <Typography
                            variant="normal"
                            fontWeight={600}
                            fontSize={16}
                            textAlign="center"
                          >
                            Drop or Select file
                          </Typography>
                          <Typography
                            variant="normal"
                            fontSize={13}
                            textAlign="center"
                            color="gray"
                          >
                            Drop files here or click browse thorough your machine
                          </Typography>
                        </Stack>
                      </Stack>
                    </StyleUpLoadImage>
                    <Box margin="24px 0">
                      {selectedThumbnail?.length > 0 &&
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
                </Stack>

                <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                  <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Số lượng"
                        type="number"
                        name="stock"
                        fullWidth
                        error={!!errors.stock}
                        helperText={errors.stock?.message}
                        required
                        InputLabelProps={{ sx: fontSize }}
                        inputProps={{ sx: fontSize }}
                      />
                    )}
                  />
                  <Controller
                    name="origin"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Xuất xứ"
                        value={watch('origin')}
                        name="origin"
                        fullWidth
                        InputLabelProps={{ sx: fontSize }}
                        inputProps={{ sx: fontSize }}
                        disabled
                      />
                    )}
                  />
                </Stack>
                <Stack>
                  <Controller
                    name="storage"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Bảo quản"
                        name="storage"
                        multiline
                        placeholder="Thông tin cách bảo quản..."
                        minRows={5}
                        fullWidth
                        error={!!errors.storage}
                        helperText={errors.storage?.message}
                        InputLabelProps={{ sx: fontSize }}
                        inputProps={{ sx: fontSize }}
                      />
                    )}
                  />
                </Stack>

                <Stack direction={mdUp ? 'row' : 'column'} gap={2}>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field: { ref, ...rest } }) => (
                      <NumericFormat
                        {...rest}
                        label="Giá gốc"
                        name="price"
                        customInput={TextField}
                        fullWidth
                        thousandSeparator
                        allowNegative={false}
                        decimalScale={2}
                        onValueChange={({ floatValue }) => {
                          setValue('price', floatValue);
                        }}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        required
                        InputLabelProps={{ sx: fontSize }}
                        inputProps={{ sx: fontSize }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Iconify icon="noto:money-bag" width={30} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="weight"
                    control={control}
                    render={({ field: { ref, ...rest } }) => (
                      <NumericFormat
                        {...rest}
                        label="Khối lượng tịnh"
                        name="weight"
                        customInput={TextField}
                        fullWidth
                        thousandSeparator
                        allowNegative={false}
                        decimalScale={2}
                        onValueChange={({ floatValue }) => {
                          setValue('weight', floatValue);
                        }}
                        error={!!errors.weight}
                        helperText={errors.weight?.message}
                        required
                        InputLabelProps={{ sx: fontSize }}
                        inputProps={{ sx: fontSize }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Iconify icon="mdi:weight-kilogram" width={30} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Stack>

                <Stack direction="column">
                  <Typography variant="body1" fontWeight={700} textAlign="left">
                    Trạng thái sản phẩm
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <FormGroup name="gender" defaultValue="false" row>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            {...field}
                            id="status"
                            name="status"
                            control={
                              <Checkbox checked={watch('status')} size="small" color="success" />
                            }
                            label={<span style={fontSize}>Hiển thị</span>}
                          />
                        )}
                      />
                      <Controller
                        name="home_flag"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            {...field}
                            id="home_flag"
                            name="home_flag"
                            control={
                              <Checkbox checked={watch('home_flag')} size="small" color="success" />
                            }
                            label={<span style={fontSize}>Trang chủ</span>}
                          />
                        )}
                      />
                      <Controller
                        name="hot_flag"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            {...field}
                            id="hot_flag"
                            name="hot_flag"
                            control={
                              <Checkbox checked={watch('hot_flag')} size="small" color="success" />
                            }
                            label={<span style={fontSize}>Sản phẩm nổi bật</span>}
                          />
                        )}
                      />
                    </FormGroup>
                  </FormControl>
                </Stack>

                <Stack direction="row" gap={2} justifyContent="flex-end" alignItems="center">
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
                    disabled={isSubmitting || (!isValid && !isAdd && !isDirty)}
                  >
                    {isAdd ? 'Thêm mới' : 'Cập nhật'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default memo(ProductAdd);

ProductAdd.propTypes = {
  isAdd: PropTypes.bool,
};

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
  font-size: 13px;
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
