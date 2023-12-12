import {
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { yellow } from '@mui/material/colors';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import ModalDelete from 'src/components/modal-delete/modal-delete';
import { statusDefaultValues } from 'src/resources/order';
import { error, success } from 'src/theme/palette';
import { fNumber } from 'src/utils/format-number';
import { notify } from 'src/utils/untils';

export default function OrderTableRow({
  code,
  customerName,
  customerPhone,
  billInvoice,
  deliveryDate,
  paymentStatus,
  status,
  hanldeGetId,
}) {
  const [open, setOpen] = useState(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [id, setId] = useState(null);

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
      const { data, status } = await order.DeleteCategory(id);
      setId(null);
      const { message } = data;
      notify(message, status);
    }
    setId(null);
  };

  const renderPaymentStatus = (
    <Label
      variant="filled"
      color={paymentStatus ? success.special : error.special}
      sx={{
        fontSize: '11px',
        pl: 1.5,
        pr: 1.5,
        width: 105,
      }}
    >
      {paymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}
    </Label>
  );

  const dataStatus = statusDefaultValues.find((item) => item.value === status);

  const renderStatus = (
    <Label
      variant="filled"
      color={dataStatus.color}
      sx={{
        fontSize: '11px',
        pl: 1.5,
        pr: 1.5,
        width: 100,
      }}
    >
      {dataStatus.label}
    </Label>
  );

  return (
    <>
      <ModalDelete
        open={openModalDelete}
        handleClose={() => setOpenModalDelete(false)}
        handleAccept={handleDeleteCategory}
      />
      {openModalEdit && (
        <CategoryEdit
          open={openModalEdit}
          handleClose={() => setOpenModalEdit(false)}
          categoryId={id}
        />
      )}
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="normal" fontSize={13} noWrap>
              {code}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="normal" fontSize={13} noWrap>
            {customerName}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="normal" fontSize={13} noWrap>
            {customerPhone}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="normal" fontSize={13} noWrap>
            {`${fNumber(billInvoice)}đ`}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="normal" fontSize={13} noWrap margin="0 auto">
            {deliveryDate}
          </Typography>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Typography variant="normal" fontSize={13} noWrap>
              {renderPaymentStatus}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Typography variant="normal" fontSize={13} noWrap>
              {renderStatus}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell width={80}>
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
          Chỉnh sửa
        </MenuItem>

        <MenuItem
          onClick={(event) => {
            handleDeleteModal(event);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}
