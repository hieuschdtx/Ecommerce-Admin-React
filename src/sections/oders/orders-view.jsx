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
import { applyFilter } from './filter-order';
import { orderActionThunk } from 'src/redux/actions/order-action';
import OrderTableRow from './order-table-row';
import { fDateTime } from 'src/utils/format-time';
import OrderTableStatus from './order-table-status';
import { customShadows } from 'src/theme/custom-shadows';
import OrderTableDate from './order-table-date';
import { useResponsive } from 'src/hooks/use-responsive';
import TableNoData from 'src/components/table-no-data/table-no-data';
import { RouterLink } from 'src/routes/components';

export default function OrdersView() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('code');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [code, setCode] = useState('');
  const [fromDay, setFromDay] = useState();
  const [today, setToday] = useState();
  const { orders } = useSelector((x) => x.rootReducer.orders);
  const dispatch = useDispatch();
  const shadow = customShadows();
  const mdUp = useResponsive('up', 'md');
  const [selectStatus, setSelectStatus] = useState(0);

  useEffect(() => {
    dispatch(orderActionThunk.GetAllOrder());
  }, []);

  const handleFilterByName = (event) => {
    setPage(0);
    setCode(event.target.value);
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
    code,
    selectStatus,
    fromDay,
    today,
  });

  const notFound = !dataFiltered.length && !!code;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Đơn hàng</Typography>
      </Stack>
      <Card sx={{ boxShadow: shadow.cards }}>
        <OrderTableStatus handleGetStatus={setSelectStatus} />
        <Stack direction={mdUp ? 'row' : 'column-reverse'} alignItems="center">
          <OrderTableDate handleFromDay={setFromDay} handleToDay={setToday} />
          <TableToolBar
            filterName={code}
            onFilterName={handleFilterByName}
            placeHolder="Nhập mã code hoặc tên khách hàng"
          />
        </Stack>

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

                {notFound && <TableNoData query={code} />}
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
