import { useEffect, useState } from 'react';
import {
  Checkbox,
  Chip,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { notify } from 'src/utils/untils';
import { CategoryService } from 'src/apis/category-service';
import ModalDelete from 'src/components/modal-delete/modal-delete';
import Iconify from 'src/components/iconify';
// import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ProductCategoriesEdit from './product-categories-edit';

export default function ProductCategoriesTableRow({
  selected,
  name,
  category,
  discount,
  createdBy,
  createdAt,
  handleClick,
  hanldeGetId,
}) {
  const [open, setOpen] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [id, setId] = useState(null);
  // const { categories } = useSelector((state) => state.rootReducer.category);

  useEffect(() => {}, []);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(null);
  };

  const handleEditModal = (event) => {
    const categoryId = hanldeGetId(event);

    setId(categoryId);
    setOpenModalEdit(true);
    setOpen(null);
  };

  const handleDeleteModal = async (event) => {
    const categoryId = hanldeGetId(event);

    setId(categoryId);
    setOpenModalDelete(true);
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
        open={openModalDelete}
        handleClose={() => setOpenModalDelete(false)}
        handleAccept={handleDeleteCategory}
      />
      {openModalEdit && (
        <ProductCategoriesEdit
          open={openModalEdit}
          handleClose={() => setOpenModalEdit(false)}
          categoryId={id}
        />
      )}
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

        <TableCell>{category}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Typography variant="subtitle2" noWrap textAlign="center">
              <Chip color="secondary" label={`${discount}%`} />
            </Typography>
          </Stack>
        </TableCell>

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
        <MenuItem onClick={(event) => handleEditModal(event)}>
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
ProductCategoriesTableRow.propTypes = {
  handleClick: PropTypes.func,
  createdBy: PropTypes.any,
  name: PropTypes.any,
  discount: PropTypes.any,
  category: PropTypes.any,
  selected: PropTypes.any,
  createdAt: PropTypes.string,
  hanldeGetId: PropTypes.func,
};
