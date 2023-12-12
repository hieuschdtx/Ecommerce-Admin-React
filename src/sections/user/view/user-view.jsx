import { useState, useEffect, memo } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { userService } from 'src/apis/user-service';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { emptyRows, getComparator } from 'src/utils/untils';
import TableNoData from 'src/components/table-no-data/table-no-data';
import { TableToolBar } from 'src/components/table-toolbar';
import { TableEmptyRow } from 'src/components/table-empty-row';
import TableDataHead from 'src/components/table-head/table-head';
import UserTableRow from '../user-table-row';
import { applyFilter } from '../filter-user';

const UserPage = () => {
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const getAllUserData = async () => {
      const dataUsers = await userService.GetAllUsers();
      const dataRoles = await userService.GetAllRoles();

      const map = {};
      dataRoles.data.forEach((item) => {
        map[item.id] = item.name;
      });

      const newUserDatas = dataUsers.data.map((user) => ({
        ...user,
        role_name: map[user.role_id] || 'Unknown Role',
      }));
      setUserData(newUserDatas);
    };

    getAllUserData();
  }, []);

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

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: userData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Quản lý người dùng</Typography>

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
            placeHolder="Tìm kiếm người dùng..."
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
                  { id: 'name', label: 'Tên người dùng' },
                  { id: 'phoneNumber', label: 'Số điện thoại' },
                  { id: 'email', label: 'Email' },
                  { id: 'role', label: 'Quyền người dùng', align: 'center' },
                  { id: 'createdAt', label: 'Ngày tạo' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <UserTableRow
                      key={row.id}
                      name={row.full_name}
                      role={row.role_name}
                      phoneNumber={row.phone_number}
                      avatarUrl={
                        row?.avatar
                          ? `${import.meta.env.VITE_BACKEND_URL}images/avatars${row.avatar}`
                          : `/assets/images/avatars/avatar_${index + 1}.jpg`
                      }
                      email={row.email}
                      createdAt={fDateTime(row.created_at, null)}
                      handleClick={(event) => handleClick(event, row.id)}
                      hanldeGetId={(event) => hanldeGetId(event, row.id)}
                    />
                  ))}

                <TableEmptyRow
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, userData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={userData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default memo(UserPage);
