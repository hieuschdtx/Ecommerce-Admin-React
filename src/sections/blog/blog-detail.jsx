import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CustomAvatar from 'src/components/avatar/avatar';
import { useResponsive } from 'src/hooks/use-responsive';
import { categoryActionThunk } from 'src/redux/actions/category-action';
import { newsActionThunk } from 'src/redux/actions/news-action';
import { useRouter } from 'src/routes/hooks';
import * as yup from 'yup';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editorConfig = {
  enterMode: 'CKEditor5.EnterMode.PARAGRAPH',
  autoGrow: true,
  placeholder: 'Nhập nội dung chi tiết về sản phẩm...',
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const fontSize = {
  fontSize: 13,
};

const defaultValues = {
  name: '',
  description: '',
  image_file: null,
  detail: '',
  created_by: '',
  category_id: '',
};

const schema = yup
  .object()
  .shape({
    name: yup.string().required('Vui lòng nhập tên bài viết'),
    category_id: yup.string().required('Tên danh mục không được để trống'),
  })
  .required();

const BlogDetailPage = ({ isAdd }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const fileInputAvatarRef = useRef(null);
  const [customIsDirty, setCustomIsDirty] = useState(true);

  const { id } = useParams();
  const { user } = useSelector((x) => x.rootReducer.user);
  const { categories } = useSelector((x) => x.rootReducer.category);
  const { getDetail } = useSelector((x) => x.rootReducer.news);
  const { result } = getDetail;
  const router = useRouter();
  const mdUp = useResponsive('up', 'md');
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isValid, isDirty, isSubmitting },
    watch,
  } = useForm({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(categoryActionThunk.getCategories());

    if (id && !isAdd) {
      dispatch(newsActionThunk.getDetailNews({ id }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (id && !isAdd) {
      const val = { ...defaultValues, ...result };
      val.image && setSelectedAvatar(`${BACKEND_URL}images/news${val.image}`);
      reset({ ...val, created_by: user.full_name });
    }
  }, [id, result]);

  const handleFileChanges = (event) => {
    const file = event.target.files[0];
    setValue('image_file', file);
    setCustomIsDirty(false);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = () => {};

  return (
    <Container>
      <Typography variant="h4">{!isAdd ? 'Cập nhật bài viết' : 'Thêm mới bài viết'}</Typography>
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
          <form id="form" onSubmit={handleSubmit(handleSubmitForm)}>
            <Stack spacing={3} direction="column">
              <Stack>
                <Typography variant="body1" fontWeight={700} textAlign="left">
                  Thông tin bài viết
                </Typography>
              </Stack>
              <Stack direction={mdUp ? 'row' : 'column'} spacing={2}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tên bài viết"
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
                  <InputLabel required sx={fontSize} id="category-select-label">
                    Danh mục
                  </InputLabel>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-select-label"
                        name="category_id"
                        id="category-select"
                        label="Quyền người dùng"
                        error={!!errors.category_id}
                        sx={fontSize}
                        required
                      >
                        {categories.map((item, index) => (
                          <MenuItem sx={fontSize} key={`${item}-${index}`} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />

                  {!!errors.category_id && (
                    <FormHelperText sx={fontSize} error>
                      {errors.category_id?.message}
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
                      minRows={4}
                      fullWidth
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
              <Stack
                direction="row"
                justifyContent={mdUp ? 'flex-start' : 'space-between'}
                spacing={2}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting || (!isAdd && !isDirty && customIsDirty)}
                >
                  {!isAdd ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  type="button"
                  onClick={() => router.push('/blog')}
                >
                  Trở lại
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
};

export default BlogDetailPage;
