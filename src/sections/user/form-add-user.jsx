import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  InputAdornment,
  InputLabel,
  FormHelperText,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';

import { userService } from 'src/apis/user-service';
import Iconify from 'src/components/iconify';
import { notify } from 'src/utils/untils';

function FormInfoUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [roles, SetRoles] = useState([]);

  useEffect(() => {
    const getRoleData = async () => {
      const { data } = await userService.GetAllRoles();
      SetRoles(data);
    };
    getRoleData();
  }, []);

  const fileInputRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      full_name: '',
      avatar_file: null,
      email: '',
      address: '',
      day_of_birth: new Date(),
      gender: false,
      phone_number: '',
      password: '',
      role_id: '',
    },
    validationSchema: validationForm,
    onSubmit: async (values) => {
      console.log('Dữ liệu đã hợp lệ', values);
      const formData = new FormData();
      formData.append('full_name', values.full_name);
      formData.append('avatar_file', values.avatar_file);
      formData.append('email', values.email);
      formData.append('address', values.address);
      formData.append('day_of_birth', values.day_of_birth.toISOString().split('T')[0]);
      formData.append('gender', values.gender);
      formData.append('phone_number', values.phone_number);
      formData.append('password', values.password);
      formData.append('role_id', values.role_id);
      const { data, status } = await userService.CreateNewUser(formData);
      const { message } = data;
      notify(message, status);
    },
  });

  const handleFileChanges = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('avatar_file', file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Grid container direction="row" justifyContent="space-between" spacing={1} sx={{ padding: 6 }}>
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
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChanges}
            />
            <img
              src={selectedImage}
              alt=""
              style={{
                borderRadius: '50%',
                width: '150px',
                height: '150px',
                objectFit: 'cover',
              }}
            />
            <Button
              variant="contained"
              sx={{
                position: 'absolute',
                backgroundColor: `${selectedImage ? 'transparent' : '#d3d4d5'}`,
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
              onClick={() => fileInputRef.current.click()}
            >
              {selectedImage ? ' ' : <i className="bi bi-camera-fill" />}
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
        <div>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">User Information</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full name"
                  name="full_name"
                  fullWidth
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.full_name && !!formik.errors.full_name}
                  helperText={formik.touched.full_name && formik.errors.full_name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && !!formik.errors.email}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  name="address"
                  fullWidth
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.address && !!formik.errors.address}
                  helperText={formik.touched.address && formik.errors.address}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      sx={{ width: '100%' }}
                      label="Date of birth"
                      onChange={(date) => formik.setFieldValue('day_of_birth', date)}
                      onBlur={formik.handleBlur}
                      value={formik.values.day_of_birth}
                      error={formik.touched.day_of_birth && !!formik.errors.day_of_birth}
                      name="day_of_birth"
                      required
                    />
                  </DemoContainer>
                  {formik.touched.day_of_birth && formik.errors.day_of_birth && (
                    <FormHelperText error sx={{ margin: '3px 14px 0' }}>
                      {formik.errors.day_of_birth}
                    </FormHelperText>
                  )}
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" id="demo-radio-buttons-group-label">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    name="gender"
                    defaultValue="false"
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    onChange={(event) =>
                      formik.setFieldValue('gender', event.target.value === 'true')
                    }
                  >
                    <FormControlLabel value="false" control={<Radio />} label="Male" />
                    <FormControlLabel value="true" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone_number"
                  label="Phone number"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone_number && !!formik.errors.phone_number}
                  helperText={formik.touched.phone_number && formik.errors.phone_number}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end">
                          <Iconify icon="twemoji:flag-vietnam" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && !!formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    name="role_id"
                    id="role-select"
                    value={formik.values.role_id}
                    label="Role"
                    onChange={formik.handleChange}
                    error={formik.touched.role_id && !!formik.errors.role_id}
                  >
                    {roles.map((item, index) => (
                      <MenuItem key={`${item}-${index}`} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.role_id && formik.errors.role_id && (
                    <FormHelperText error>{formik.errors.role_id}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

const validationForm = Yup.object({
  full_name: Yup.string().required('Vui lòng nhập tên'),
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  address: Yup.string().required('Vui lòng nhập địa chỉ'),
  day_of_birth: Yup.date().required('Vui lòng chọn ngày sinh'),
  phone_number: Yup.string()
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được nhập số')
    .min(10, 'Số điện thoại không hợp lệ')
    .required('Vui lòng nhập số điện thoại'),
  password: Yup.string()
    .required('Vui lòng nhập password')
    .min(8, 'Password phải có độ dài hơn 8 kí tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password phải chứa ít nhất một ký tự in hoa, một số, kí tự đặc biệt'
    ),
  role_id: Yup.string().required('Vui lòng chọn quyền người dùng'),
});

export { FormInfoUser };
