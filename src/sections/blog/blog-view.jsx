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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableDataHead from 'src/components/table-head/table-head';
import { TableToolBar } from 'src/components/table-toolbar';
import { categoryActionThunk } from 'src/redux/actions/category-action';
import { newsActionThunk } from 'src/redux/actions/news-action';
import { RouterLink } from 'src/routes/components';
import { applyFilter } from './filter-news';
import { emptyRows, getComparator } from 'src/utils/untils';
import { TableEmptyRow } from 'src/components/table-empty-row';
import TableNoData from 'src/components/table-no-data/table-no-data';
import BlogTableRow from './blog-table-row';
import { fDateTime } from 'src/utils/format-time';

export default function BlogView() {
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [dataNews, setDataNews] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const dispatch = useDispatch();
  const { news } = useSelector((x) => x.rootReducer.news);
  const { categories } = useSelector((x) => x.rootReducer.category);

  useEffect(() => {
    dispatch(newsActionThunk.getAllNews());
    dispatch(categoryActionThunk.getCategories());
  }, [dispatch]);

  useEffect(() => {
    let map = {};
    categories.forEach((item) => {
      map[item.id] = item.name;
    });

    let newDataNews = news.map((news) => ({
      ...news,
      category_name: map[news.category_id] || 'Unknown',
    }));

    setDataNews(newDataNews);
  }, [news, categories]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

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

  const dataFiltered = applyFilter({
    inputData: dataNews,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const hanldeGetId = (event, id) => {
    event.preventDefault();
    return id;
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Bài viết</Typography>

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
            placeHolder="Tìm kiếm bài viết..."
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
                  { id: 'name', label: 'Tên bài viết' },
                  { id: 'description', label: 'Mô tả' },
                  { id: 'created_at', label: 'Ngày tạo' },
                  { id: 'created_by', label: 'Người tạo' },
                  { id: 'category_name', label: 'Danh mục' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <BlogTableRow
                      key={row.id}
                      name={row.name}
                      description={row.description}
                      createdAt={fDateTime(row.created_at, null)}
                      createdBy={row.created_by}
                      categoryName={row.category_name}
                      hanldeGetId={(event) => hanldeGetId(event, row.id)}
                    />
                  ))}

                <TableEmptyRow
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataNews.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={dataNews.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
