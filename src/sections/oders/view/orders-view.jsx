import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Typography,
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import TableDataHead from 'src/components/table-head/table-head';
import { TableToolBar } from 'src/components/table-toolbar';
import { TableEmptyRow } from 'src/components/table-empty-row';
import Scrollbar from 'src/components/scrollbar';
import { emptyRows, getComparator } from 'src/utils/untils';
import { applyFilter } from '../filter-order';
import { orderActionThunk } from 'src/redux/actions/order-action';
import OrderTableRow from '../order-table-row';
import { fDate, fDateTime, fStringToDate } from 'src/utils/format-time';

export default function OrdersView() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState('asc');
  const [filterName, setFilterName] = useState('');
  const { orders } = useSelector((x) => x.rootReducer.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(orderActionThunk.GetAllOrder());
  }, [dispatch]);

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const hanldeGetId = (event, id) => {
    event.preventDefault();
    return id;
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const dataFiltered = applyFilter({
    inputData: orders,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Đơn hàng</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => setOpen(true)}
        >
          Thêm mới
        </Button>
      </Stack>
      <Card>
        <TableToolBar
          filterName={filterName}
          onFilterName={handleFilterByName}
          placeHolder="Tìm kiếm đơn hàng..."
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableDataHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'code', label: 'Mã code' },
                  { id: 'customer_name', label: 'Tên người nhận' },
                  { id: 'customer_phone', label: 'Số điện thoại' },
                  { id: 'bill_invoice', label: 'Tổng hóa đơn' },
                  { id: 'delivery_date', label: 'Ngày giao hàng' },
                  { id: 'payment_status', label: 'Trạng thái thanh toán', align: 'center' },
                  { id: 'status', label: 'Trạng thái đơn hàng', align: 'center' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <OrderTableRow
                      key={row.id}
                      code={row.code}
                      customerName={row.customer_name}
                      customerPhone={row.customer_phone}
                      billInvoice={row.bill_invoice}
                      deliveryDate={fDateTime(row.delivery_date)}
                      paymentStatus={row.payment_status}
                      status={row.status}
                      hanldeGetId={(event) => hanldeGetId(event, row.id)}
                    />
                  ))}

                <TableEmptyRow
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, orders.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      <TablePagination
        page={page}
        component="div"
        count={orders.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
}
