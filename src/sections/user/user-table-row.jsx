import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { error, secondary, success } from 'src/theme/palette';
import { roleConst } from 'src/resources/role';
import { yellow } from '@mui/material/colors';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function UserTableRow({
  name,
  role,
  phoneNumber,
  avatarUrl,
  email,
  createdAt,
  hanldeGetId,
}) {
  const [open, setOpen] = useState(null);
  const router = useRouter();
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEditUser = (event) => {
    const userId = hanldeGetId(event);
    router.push(`${userId}/edit`);
    setOpen(null);
  };

  const renderColor = (val) => {
    if (val === roleConst.guest) return yellow[900];
    if (val === roleConst.employee) return success.special;
    if (val === roleConst.manager) return secondary.main;
    if (val === roleConst.administrator) return error.special;
  };

  const renderRole = (
    <Label
      variant="filled"
      color={renderColor(role)}
      sx={{
        fontSize: '11px',
        pl: 1.5,
        pr: 1.5,
        width: 90,
      }}
    >
      {role}
    </Label>
  );

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="normal" fontSize={13} noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="normal" fontSize={13} noWrap>
            {phoneNumber}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="normal" fontSize={13} noWrap>
            {email}
          </Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            {renderRole}
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="normal" fontSize={13} noWrap>
            {createdAt}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEditUser}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Chỉnh sửa
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  phoneNumber: PropTypes.any,
  email: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  createdAt: PropTypes.string,
};
