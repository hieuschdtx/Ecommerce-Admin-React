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
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableDataHead from 'src/components/table-head/table-head';
import { TableToolBar } from 'src/components/table-toolbar';
import { fDateTime } from 'src/utils/format-time';
import { TableEmptyRow } from 'src/components/table-empty-row';
import { connection } from 'src/utils/signalR';
import { productCategoriesActionThunk } from 'src/redux/actions/product-categories-action';
import { emptyRows, getComparator } from 'src/utils/untils';
import TableNoData from 'src/components/table-no-data/table-no-data';
import { categoryActionThunk } from 'src/redux/actions/category-action';
import { promotionActionThunk } from 'src/redux/actions/promotion-action';
import ProductCategoriesTableRow from './product-categories-table-row';
import { applyFilter } from './filter-product-categories';
import ProductCategoriesAdd from './product-categories-add';

export default function ProductCategoriesView() {
  const [filterName, setFilterName] = useState('');
  const [order, setOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [proCategories, setProCategories] = useState([]);
  const dispatch = useDispatch();

  const { productCategories } = useSelector((state) => state.rootReducer.productCategories);
  const { categories } = useSelector((state) => state.rootReducer.category);
  const { promotion } = useSelector((state) => state.rootReducer.promotions);

  useEffect(() => {
    if (productCategories.length === 0) {
      dispatch(productCategoriesActionThunk.getproductCategories());
    }
    if (categories.length === 0) {
      dispatch(categoryActionThunk.getCategories());
    }
    if (promotion.length === 0) {
      dispatch(promotionActionThunk.getPromotions());
    }
  }, [dispatch, productCategories, categories, promotion]);

  useEffect(() => {
    connection.on('RELOAD_DATA_CHANGE', () => {
      dispatch(productCategoriesActionThunk.getproductCategories());
    });
  }, [dispatch]);

  useEffect(() => {
    const mapCategory = {};
    const mapPromotion = {};

    categories.forEach((item) => {
      mapCategory[item.id] = item.name;
    });
    promotion.forEach((item) => {
      mapPromotion[item.id] = item.discount;
    });

    const newproductCategories = productCategories.map((item) => ({
      ...item,
      category_name: mapCategory[item.category_id],
      promotion_discount: mapPromotion[item.promotion_id],
    }));

    setProCategories(newproductCategories);
  }, [categories, productCategories, promotion]);

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const hanldeGetId = (event, id) => {
    event.preventDefault();
    return id;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const dataFiltered = applyFilter({
    inputData: proCategories,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Danh mục sản phẩm</Typography>
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
          <Stack height={96} paddingTop={2}>
            <TableToolBar
              filterName={filterName}
              onFilterName={handleFilterByName}
              placeHolder="Tìm kiếm danh mục sản phẩm..."
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
                    { id: 'name', label: 'Tên danh mục sản phẩm', tooltip: '' },
                    { id: 'category', label: 'Danh mục', tooltip: '' },
                    {
                      id: 'discount',
                      label: 'Mức giảm giá',
                      align: 'center',
                      tooltip: 'Giảm giá danh mục',
                    },
                    { id: 'createdBy', label: 'Người tạo' },
                    { id: 'createdAt', label: 'Ngày tạo' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <ProductCategoriesTableRow
                        key={row.id}
                        name={row.name}
                        category={row.category_name}
                        discount={row.promotion_discount}
                        createdBy={row.created_by}
                        createdAt={fDateTime(row.created_at, null)}
                        hanldeGetId={(event) => hanldeGetId(event, row.id)}
                      />
                    ))}
                  <TableEmptyRow
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, proCategories.length)}
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
          count={proCategories.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
      <ProductCategoriesAdd open={open} handleClose={() => setOpen(false)} />
    </>
  );
}
