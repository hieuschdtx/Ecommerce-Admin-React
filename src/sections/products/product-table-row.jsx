import {
  Avatar,
  Checkbox,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from 'src/components/iconify';

export default function ProductTableRow({
  name,
  avatar,
  description,
  stock,
  status,
  product_category_id,
  selected,
  handleClick,
  hanldeGetId,
}) {
  const [open, setOpen] = useState(null);
  //   const [openModalDelete, setOpenModalDelete] = useState(false);
  //   const [openModalEdit, setOpenModalEdit] = useState(false);
  //   const [id, setId] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell component="th" scope="row" padding="none" align="center">
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            <Avatar alt="" src={avatar && `${import.meta.env.VITE_BACKEND_URL}uploads${avatar}`} />
          </Stack>
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} width="150px">
            <Typography
              variant="subtitle2"
              fontWeight="normal"
              noWrap
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {description}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            {stock}
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            <Checkbox disableRipple checked={status} />
          </Stack>
        </TableCell>

        <TableCell>{product_category_id}</TableCell>

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
        <MenuItem>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

ProductTableRow.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  description: PropTypes.string,
  stock: PropTypes.number,
  status: PropTypes.bool,
  product_category_id: PropTypes.string,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  hanldeGetId: PropTypes.func,
};
