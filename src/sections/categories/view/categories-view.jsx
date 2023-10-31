import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import Scrollbar from 'src/components/scrollbar';
import { fDateTime } from 'src/utils/format-time';
import TableNoData from 'src/components/table-no-data/table-no-data';
import { emptyRows, getComparator } from 'src/utils/untils';
import { TableToolBar } from 'src/components/table-toolbar';
import { TableEmptyRow } from 'src/components/table-empty-row';
import TableDataHead from 'src/components/table-head/table-head';
import { connection } from 'src/utils/signalR';
import { categoryActionThunk } from 'src/redux/actions/category-action';
import { applyFilter } from '../filter-category';
import CategoriesTableRow from '../category-table-row';
import CategoryModal from '../category-modal';

export default function CategoriesView() {
  const [filterName, setFilterName] = useState('');
  const [order, setOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.rootReducer.category);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(categoryActionThunk.getCategories());
    }
  }, [dispatch, categories]);

  useEffect(() => {
    connection.on('RELOAD_DATA_CHANGE', () => {
      dispatch(categoryActionThunk.getCategories());
    });
  }, [dispatch]);

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

  const handleDelete = (event, id) => {
    event.preventDefault();
    return id;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = categories.map((n) => n.id);
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
    inputData: categories,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Categories</Typography>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpen(true)}
          >
            New Category
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
                  rowCount={categories.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'description', label: 'Description' },
                    { id: 'createdBy', label: 'Created by' },
                    { id: 'createdAt', label: 'Created at' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <CategoriesTableRow
                        key={row.id}
                        name={row.name}
                        description={row.description}
                        createdBy={row.created_by}
                        createdAt={fDateTime(row.created_at, null)}
                        selected={selected.indexOf(row.id) !== -1}
                        handleClick={(event) => handleClick(event, row.id)}
                        handleDelete={(event) => handleDelete(event, row.id)}
                      />
                    ))}

                  <TableEmptyRow
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, categories.length)}
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
          count={categories.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>
      <CategoryModal open={open} handleClose={() => setOpen(false)} />
    </>
  );
}
