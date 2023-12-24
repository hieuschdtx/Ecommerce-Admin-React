import {
  Container,
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
import { useRouter } from 'src/routes/hooks';

export default function BlogTableRow({
  name,
  description,
  createdAt,
  createdBy,
  categoryName,
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

  const handleEditNews = (event) => {
    const newId = hanldeGetId(event);
    router.push(`${newId}/edit`);
    setOpen(null);
  };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={2} width={300}>
            <Typography
              variant="normal"
              fontSize={13}
              noWrap
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell component="th" scope="row" padding="normal">
          <Stack direction="row" alignItems="center" spacing={2} width={150}>
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
        <TableCell component="th" scope="row" padding="normal">
          <Typography variant="normal" fontSize={13} noWrap>
            {createdAt}
          </Typography>
        </TableCell>
        <TableCell component="th" scope="row" padding="normal">
          <Typography variant="normal" fontSize={13} noWrap>
            {createdBy}
          </Typography>
        </TableCell>
        <TableCell component="th" scope="row" padding="normal">
          <Typography variant="normal" fontSize={13} noWrap>
            {categoryName}
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
        <MenuItem>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          chỉnh sửa
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Xóa
        </MenuItem>
      </Popover>
    </>
  );
}
