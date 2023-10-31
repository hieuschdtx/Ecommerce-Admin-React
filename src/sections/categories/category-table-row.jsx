import {
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
import { CategoryService } from 'src/apis/category-service';
import Iconify from 'src/components/iconify';
import ModalDelete from 'src/components/modal-delete/modal-delete';
import { notify } from 'src/utils/untils';

export default function CategoriesTableRow({
  selected,
  name,
  description,
  createdBy,
  createdAt,
  handleClick,
  handleDelete,
}) {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(null);
  };

  const handleDeleteModal = async (event) => {
    const categoryId = handleDelete(event);
    setId(categoryId);
    setOpenModal(true);
    setOpen(null);
  };

  const handleDeleteCategory = async () => {
    if (id) {
      const data = await CategoryService.DeleteCategory(id);
      setId(null);
      const { message, success } = data;
      notify(message, success);
    }
    setId(null);
  };

  return (
    <>
      <ModalDelete
        open={openModal}
        handleClose={() => setOpenModal(false)}
        handleAccept={handleDeleteCategory}
      />
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{description}</TableCell>

        <TableCell>{createdBy}</TableCell>

        <TableCell>{createdAt}</TableCell>

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
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={(event) => {
            handleDeleteModal(event);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
CategoriesTableRow.propTypes = {
  handleClick: PropTypes.func,
  createdBy: PropTypes.any,
  name: PropTypes.any,
  description: PropTypes.any,
  selected: PropTypes.any,
  createdAt: PropTypes.string,
  handleDelete: PropTypes.func,
};
