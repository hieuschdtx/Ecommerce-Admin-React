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
import { TableEmptyRow } from 'src/components/table-empty-row';
import TableDataHead from 'src/components/table-head/table-head';
import TableNoData from 'src/components/table-no-data/table-no-data';
import { TableToolBar } from 'src/components/table-toolbar';
import { productActionThunk } from 'src/redux/actions/product-action';
import { productCategoriesActionThunk } from 'src/redux/actions/product-categories-action';
import { connection } from 'src/utils/signalR';
import { RouterLink } from 'src/routes/components';
import { emptyRows, getComparator } from 'src/utils/untils';
import { applyFilter } from '../filter-product';
import ProductTableRow from '../product-table-row';

export default function ProductsView() {
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [newProducts, setNewProducts] = useState([]);
  const dispatch = useDispatch();

  const { productCategories } = useSelector((state) => state.rootReducer.productCategories);
  const { products, productPrices } = useSelector((state) => state.rootReducer.products);

  useEffect(() => {
    dispatch(productActionThunk.getProductPrices());
  }, [dispatch]);
  useEffect(() => {
    dispatch(productCategoriesActionThunk.getproductCategories());
  }, [dispatch]);
  useEffect(() => {
    dispatch(productActionThunk.getProduct());
  }, [dispatch]);

  useEffect(() => {
    connection.on('RELOAD_DATA_CHANGE', () => {
      dispatch(productActionThunk.getProduct());
    });
  }, [dispatch]);

  useEffect(() => {
    const mapProCategory = {};
    productCategories.forEach((item) => {
      mapProCategory[item.id] = item.name;
    });
    const newProduct = products.map((item) => ({
      ...item,
      product_category_name: mapProCategory[item.product_category_id],
      product_prices: productPrices.filter((v) => v.product_id === item.id),
    }));
    setNewProducts(newProduct);
  }, [productCategories, products, productPrices]);

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

  const hanldeGetId = (event, id) => {
    event.preventDefault();
    return id;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const dataFiltered = applyFilter({
    inputData: newProducts,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Sản phẩm</Typography>
        <Button
          component={RouterLink}
          href="new"
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Thêm mới
        </Button>
      </Stack>
      <Card>
        <Stack height={96} paddingTop={2}>
          <TableToolBar
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeHolder="Tìm kiếm sản phẩm..."
          />
        </Stack>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableDataHead
                order={order}
                orderBy={orderBy}
                rowCount={newProducts.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'name', label: 'Tên sản phẩm' },
                  { id: 'avatar', label: 'Ảnh đại diện', align: 'center' },
                  { id: 'description', label: 'Mô tả' },
                  { id: 'stock', label: 'Số lượng', align: 'center' },
                  { id: 'status', label: 'Trạng thái', align: 'center' },
                  { id: 'product_category_id', label: 'Danh mục sản phẩm' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <ProductTableRow
                      key={row.id}
                      name={row.name}
                      avatar={row.avatar}
                      description={row.description}
                      stock={row.stock}
                      status={row.status}
                      product_category_id={row.product_category_name}
                      hanldeGetId={(event) => hanldeGetId(event, row.id)}
                    />
                  ))}

                <TableEmptyRow
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, newProducts.length)}
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
        count={newProducts.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
  );
}
