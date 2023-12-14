import {
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { statusDefaultValues } from 'src/resources/order';
import { useRouter } from 'src/routes/hooks';
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
  const router = useRouter();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = (event) => {
    setOpen(null);
  };

  const handleViewOrder = (event) => {
    const orderId = hanldeGetId(event);
    router.push(`/order/${orderId}/edit`);
    setOpen(null);
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
        <MenuItem onClick={(event) => handleViewOrder(event)}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          Xem
        </MenuItem>
      </Popover>
    </>
  );
}
