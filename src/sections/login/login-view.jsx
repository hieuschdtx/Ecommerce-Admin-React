import { useState } from 'react';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { userService } from 'src/apis/user-service';
import { useRouter } from 'src/routes/hooks';
import { jwtConst } from 'src/resources/jwt-const';
import { storage } from 'src/utils/storage';
import { auth } from 'src/utils/auth';
import { notify } from 'src/utils/untils';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const fontSize = {
  fontSize: 13,
};
const defaultValues = {
  phone_number: '',
  password: '',
};

const schema = Yup.object()
  .shape({
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
    phone_number: Yup.string().required('Vui lòng nhập số điện thoại'),
  })
  .required();

export default function LoginView() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleLoginForm = async (value) => {
    const {
      data: { message, success, data },
    } = await userService.LoginUser(value);
    notify(message, success);

    if (success) {
      storage.setCache(jwtConst.token, data);
      auth.SetUserInfo(data);

      setTimeout(() => {
        router.push('/');
      }, 2500);
    }
  };

  const renderForm = (
    <form onSubmit={handleSubmit(handleLoginForm)}>
      <Stack spacing={3}>
        <Controller
          name="phone_number"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="phone_number"
              label="Số điện thoại"
              fullWidth
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
              required
              inputProps={{ sx: fontSize }}
              InputLabelProps={{ sx: fontSize }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              name="password"
              label="Mật khẩu"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}
              required
              inputProps={{ sx: fontSize }}
              InputLabelProps={{ sx: fontSize }}
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
          )}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        disabled={isSubmitting}
      >
        Login
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ mt: 2, mb: 5 }}>
            Sign in to MeatDeli Admin
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
