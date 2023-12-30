import {
  Avatar,
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
import { productService } from 'src/apis/product-service';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import ModalDelete from 'src/components/modal-delete/modal-delete';
import { useRouter } from 'src/routes/hooks';
import { error, success } from 'src/theme/palette';
import { notify } from 'src/utils/untils';

export default function ProductTableRow({
  name,
  avatar,
  description,
  stock,
  status,
  product_category_id,
  hanldeGetId,
}) {
  const [open, setOpen] = useState(null);
  const router = useRouter();
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [id, setId] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(null);
  };

  const handleProduct = (event) => {
    const productId = hanldeGetId(event);
    setOpen(null);
    router.push(`${productId}/edit`);
  };

  const handleDeleteModal = async (event) => {
    const productId = hanldeGetId(event);

    setId(productId);
    setOpenModalDelete(true);
    setOpen(null);
  };

  const handleDeleteProduct = async () => {
    if (id) {
      const {
        data: { message, success },
      } = await productService.deleteProduct({ id });
      notify(message, success);
    }
    setId(null);
  };

  const renderDiscount = (
    <Label
      variant="filled"
      color={status ? success.special : error.special}
      sx={{
        fontSize: '11px',
        pl: 1.5,
        pr: 1.5,
        width: 70,
      }}
    >
      {status ? 'Hiển thị' : 'Đã khóa'}
    </Label>
  );

  return (
    <>
      <ModalDelete
        open={openModalDelete}
        handleClose={() => setOpenModalDelete(false)}
        handleAccept={handleDeleteProduct}
      />
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="normal" fontSize={13} noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell component="th" scope="row" padding="none" align="center">
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            <Avatar
              alt=""
              src={avatar && `${import.meta.env.VITE_BACKEND_URL}images/products${avatar}`}
            />
          </Stack>
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} width="150px">
            <Typography
              variant="normal"
              fontSize={13}
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
            <Typography variant="normal" fontSize={13}>
              {stock}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            {renderDiscount}
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="normal" fontSize={13}>
            {product_category_id}
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
        <MenuItem onClick={(event) => handleProduct(event)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          chỉnh sửa
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={(event) => handleDeleteModal(event)}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
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
  handleClick: PropTypes.func,
  hanldeGetId: PropTypes.func,
};
