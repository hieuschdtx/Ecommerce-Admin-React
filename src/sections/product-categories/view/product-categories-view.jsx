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
import ProductCategoriesTableRow from '../product-categories-table-row';
import { applyFilter } from '../filter-product-categories';
import ProductCategoriesAdd from '../product-categories-add';

export default function ProductCategoriesView() {
  const [filterName, setFilterName] = useState('');
  const [order, setOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
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
    try {
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
    } catch (error) {
      console.log(error);
    }
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = proCategories.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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
          <Typography variant="h4">Product categories</Typography>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpen(true)}
          >
            New Product category
          </Button>
        </Stack>

        <Card>
          <TableToolBar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeHolder="Search category..."
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableDataHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={proCategories.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Tên', tooltip: '' },
                    { id: 'category', label: 'Category' },
                    { id: 'discount', label: 'Discount', align: 'center' },
                    { id: 'createdBy', label: 'Created by' },
                    { id: 'createdAt', label: 'Created at' },
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
                        selected={selected.indexOf(row.id) !== -1}
                        handleClick={(event) => handleClick(event, row.id)}
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
