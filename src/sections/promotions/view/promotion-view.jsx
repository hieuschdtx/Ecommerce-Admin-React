import { useState, useEffect } from 'react';

import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { emptyRows, getComparator } from 'src/utils/untils';
import { useDispatch, useSelector } from 'react-redux';
import { connection } from 'src/utils/signalR';
import Scrollbar from 'src/components/scrollbar';
import { TableToolBar } from 'src/components/table-toolbar';
import TableDataHead from 'src/components/table-head/table-head';
import { fCompareTime, fDateTime } from 'src/utils/format-time';
import { promotionActionThunk } from 'src/redux/actions/promotion-action';
import { TableEmptyRow } from 'src/components/table-empty-row';
import TableNoData from 'src/components/table-no-data/table-no-data';
import PromotionAdd from '../promotion-add';
import { applyFilter } from '../filter-promotion';
import PromotionTableRow from '../promotion-table-row';

export default function PromotionView() {
  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const { promotion } = useSelector((state) => state.rootReducer.promotions);

  useEffect(() => {
    if (promotion.length === 0) {
      dispatch(promotionActionThunk.getPromotions());
    }
  }, [dispatch, promotion]);

  useEffect(() => {
    connection.on('RELOAD_DATA_CHANGE', () => {
      dispatch(promotionActionThunk.getPromotions());
    });
  }, [dispatch]);

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const expiryPromotion = (toDay) => fCompareTime(toDay);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const hanldeGetId = (event, id) => {
    event.preventDefault();
    return id;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const dataFiltered = applyFilter({
    inputData: promotion,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Khuyến mãi</Typography>

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
            placeHolder="Tìm kiếm khuyến mãi..."
          />
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableDataHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: 'name', label: 'Tên khuyến mãi' },
                    { id: 'discount', label: 'Phần trăm giảm', align: 'center' },
                    { id: 'from_day', label: 'Từ ngày' },
                    { id: 'to_day', label: 'Đến ngày' },
                    { id: 'status', label: 'Trạng thái', align: 'center' },
                    { id: 'expiry', label: 'Thời hạn', align: 'center' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <PromotionTableRow
                        key={row.id}
                        name={row.name}
                        discount={row.discount}
                        from_day={fDateTime(row.from_day)}
                        to_day={fDateTime(row.to_day)}
                        status={row.status}
                        expiry={expiryPromotion(row.to_day)}
                        hanldeGetId={(event) => hanldeGetId(event, row.id)}
                      />
                    ))}

                  <TableEmptyRow
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, promotion.length)}
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
          count={promotion.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
      {open && <PromotionAdd isEdit={false} open={open} setOpen={() => setOpen(false)} />}
    </>
  );
}
