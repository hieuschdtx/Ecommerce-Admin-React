import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname, useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';
import { jwtConst } from 'src/resources/jwt-const';
import { userService } from 'src/apis/user-service';
import { storage } from 'src/utils/storage';

import { NAV } from './config-layout';
import navConfig from './config-navigation';
import { useDispatch, useSelector } from 'react-redux';
import { userActionThunk } from 'src/redux/actions/user-action';
import { roleActionThunk } from 'src/redux/actions/role-action';
import { auth } from 'src/utils/auth';

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const userFilter = storage.getCache(jwtConst.user);
  const { user } = useSelector((x) => x.rootReducer.user);
  const { role } = useSelector((x) => x.rootReducer.role);

  useEffect(() => {
    dispatch(userActionThunk.getUserById({ id: userFilter?.id }));
  }, []);

  useEffect(() => {
    if (!Array.isArray(user)) {
      dispatch(roleActionThunk.getRoleById({ id: user.role_id }));
    }
  }, [user]);

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={user.avatar && `${BACKEND_URI}images/avatars/${user.avatar}`} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{user.full_name}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {role?.name}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ width: '200px', margin: '0 auto' }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();
  const isAdmin = auth.GetAccess(storage.getCache(jwtConst.token));

  const active = item.path === pathname;

  return (
    <div>
      {item.path === '/logout' ? (
        <ListItemButtons
          item={item}
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            ...(active && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        />
      ) : (
        <ListItemButton
          component={RouterLink}
          href={item.path}
          disabled={!isAdmin === item.disabled}
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            ...(active && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
            {item.icon}
          </Box>
          <Box component="span">{item.title}</Box>
        </ListItemButton>
      )}
    </div>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};

const ListItemButtons = ({ item, sx }) => {
  const router = useRouter();
  const handlerLogout = async () => {
    await userService.LogoutUser();
    storage.removeCache(jwtConst.user);
    storage.removeCache(jwtConst.token);
    router.push('/login');
  };

  return (
    <ListItemButton sx={sx} onClick={handlerLogout}>
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>
      <Box component="span">{item.title}</Box>
    </ListItemButton>
  );
};

ListItemButtons.propTypes = {
  item: PropTypes.object,
  sx: PropTypes.shape({}),
};
