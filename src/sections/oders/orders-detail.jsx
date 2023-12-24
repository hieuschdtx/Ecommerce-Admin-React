import { Avatar, Box, Button, Card, Container, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { orderActionThunk } from 'src/redux/actions/order-action';
import { statusDefaultValues } from 'src/resources/order';
import { useRouter } from 'src/routes/hooks';
import { customShadows } from 'src/theme/custom-shadows';
import { error, grey, primary } from 'src/theme/palette';
import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import OrderEdit from './order-edit';
import { useResponsive } from 'src/hooks/use-responsive';
import { notify } from 'src/utils/untils';
import { connection } from 'src/utils/signalR';
import OrderExport from './order-export';
import { productActionThunk } from 'src/redux/actions/product-action';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RenderInfoOrder = ({ title, value, sx }) => {
  return (
    <Stack display="grid" gridTemplateColumns="1fr 2fr" mt={2} gap={0.5}>
      <Typography variant="normal" fontSize={14} color={grey[800]} width="auto">
        {title}
      </Typography>
      <Typography variant="normal" fontSize={14} fontWeight={600} width={1} textAlign="left">
        {value}
      </Typography>
    </Stack>
  );
};

const RenderInfoPrice = ({ title, value }) => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="normal" fontSize={14} minWidth={110} textAlign="left" color={grey[800]}>
        {title}
      </Typography>
      <Typography variant="normal" fontSize={14} fontWeight={600} width={110} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
};

export default function OrderDetail() {
  const { id } = useParams();
  const { filterOrderId, orders, loading, message, success } = useSelector(
    (x) => x.rootReducer.orders
  );
  const { filterOrder } = filterOrderId;
  const dispatch = useDispatch();
  const shadow = customShadows();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const mdUp = useResponsive('up', 'md');
  const smDown = useResponsive('down', 'sm');

  useEffect(() => {
    dispatch(orderActionThunk.GetAllOrder());
    dispatch(productActionThunk.getProductPrices());
    if (id) {
      dispatch(orderActionThunk.FilterOrderDetail({ id }));
      // dispatch(orderActionThunk.cleanMessage());
    }
  }, [id]);

  useEffect(() => {
    connection.on('RELOAD_DATA_CHANGE', () => {
      dispatch(orderActionThunk.GetAllOrder());
    });
  }, [dispatch]);

  useEffect(() => {
    if (!loading && message !== null) {
      notify(message, success);
      dispatch(orderActionThunk.cleanMessage());
    }
  }, [loading, message]);

  const filterDataOrder = orders.find((item) => item.id === id);
  const orderStatus = statusDefaultValues.find((item) => item.value === filterDataOrder?.status);

  const renderStatus = (
    <Label
      variant="filled"
      color={orderStatus?.color}
      sx={{
        fontSize: '12px',
        pl: 1.5,
        pr: 1.5,
        width: 'auto',
      }}
    >
      {orderStatus?.label}
    </Label>
  );

  const renderPaymentStatus = (
    <Label
      variant="filled"
      color={filterDataOrder?.payment_status ? primary.main : error.main}
      sx={{
        fontSize: '12px',
        pl: 1.5,
        pr: 1.5,
        width: 'auto',
      }}
    >
      {filterDataOrder?.payment_status ? 'Đơn hàng đã thanh toán' : 'Đơn hàng chưa được thanh toán'}
    </Label>
  );

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleOpenExport = () => {
    setOpenExport(true);
  };
  const handleCloseExport = () => {
    setOpenExport(false);
  };

  return (
    <Container>
      {open && <OrderEdit open={open} handleClose={handleCloseModal} />}
      {openExport && (
        <OrderExport
          open={openExport}
          handleClose={handleCloseExport}
          products={filterOrder}
          orderSelect={filterDataOrder}
        />
      )}
      {filterDataOrder && (
        <>
          <Stack
            direction={smDown ? 'column' : 'row'}
            gap={2}
            justifyContent="space-between"
            mb={4}
          >
            <Box display="flex" gap={1}>
              <Stack mt={0.2}>
                <IconButton onClick={() => router.push('/order')}>
                  <Iconify icon="ic:round-arrow-back-ios" width={18} />
                </IconButton>
              </Stack>

              <Stack direction="column" alignItems="flex-start">
                <Typography variant="h4">Đơn hàng {filterDataOrder.code}</Typography>
                <Typography variant="normal" fontSize={14} color={grey[500]}>
                  {fDateTime(filterDataOrder.created_at)}
                </Typography>
              </Stack>
              <Stack mt={0.7}>{renderStatus}</Stack>
            </Box>
            <Box display="flex" gap={2} alignItems="center" justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleOpenExport}
                color="inherit"
                startIcon={<Iconify icon="material-symbols:print" />}
              >
                Tạo hóa đơn
              </Button>
              <Button
                variant="contained"
                onClick={handleOpenModal}
                color="inherit"
                startIcon={<Iconify icon="fluent:edit-28-filled" />}
              >
                Chỉnh sửa
              </Button>
            </Box>
          </Stack>
          <Stack direction={mdUp ? 'row' : 'column'} gap={3} alignItems="baseline">
            <Card sx={{ boxShadow: shadow.cards, padding: 3, flex: 2, width: 1 }}>
              <Typography variant="h5">Chi tiết</Typography>
              {filterOrder.map((item) => (
                <Stack
                  key={item.id}
                  direction="row"
                  alignItems="center"
                  padding="16px 0"
                  gap={2}
                  borderBottom="2px dashed rgb(244, 246, 248)"
                >
                  <Avatar
                    variant="rounded"
                    alt={item.product_name}
                    sx={{ width: 56, height: 56 }}
                    src={`${BACKEND_URL}images/products${item.product_avatar}`}
                  />
                  <Box display="flex" flexDirection="column" gap={0.5} flex="1 1 auto">
                    <Typography variant="normal" fontSize={14}>
                      {item.product_name}
                    </Typography>
                    <Typography variant="normal" fontSize={12} color={grey[600]}>
                      {item.pc_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="normal" fontSize={14}>
                      {`x${item.quantity}`}
                    </Typography>
                  </Box>
                  <Box width={110} textAlign="right">
                    <Typography variant="normal" fontSize={14} fontWeight={600}>
                      {`${fNumber(item.total_amount)} đ`}
                    </Typography>
                  </Box>
                </Stack>
              ))}
              <Stack direction="column" gap={2} alignItems="flex-end" mt={3}>
                <RenderInfoPrice
                  title={'Tạm tính'}
                  value={`${fNumber(filterDataOrder.bill_invoice)} đ`}
                />
                <RenderInfoPrice
                  title={'Phí vận chuyển'}
                  value={`${filterDataOrder.is_vat ? fNumber(30000) : 0} đ`}
                />
                <RenderInfoPrice
                  title={'Tổng đơn hàng'}
                  value={`${
                    filterDataOrder.is_vat
                      ? fNumber(filterDataOrder.bill_invoice + 30000)
                      : fNumber(filterDataOrder.bill_invoice)
                  } đ`}
                />
                <Stack direction="row" justifyContent="flex-end">
                  {renderPaymentStatus}
                </Stack>
              </Stack>
            </Card>
            <Card sx={{ boxShadow: shadow.cards, padding: 3, flex: 1, width: 1 }}>
              <Box paddingBottom={3} borderBottom="2px dashed rgb(244, 246, 248)">
                <Typography variant="h5">Thông tin khách hàng nhận</Typography>

                <RenderInfoOrder title="Tên người nhận:" value={filterDataOrder.customer_name} />
                <RenderInfoOrder title="Số điện thoại:" value={filterDataOrder.customer_phone} />
                <RenderInfoOrder title="Email:" value={filterDataOrder.customer_email} />
              </Box>
              <Box paddingBottom={3} borderBottom="2px dashed rgb(244, 246, 248)" mt={2}>
                <Typography variant="h5">Thông tin giao hàng</Typography>
                <RenderInfoOrder
                  title="Địa chỉ giao hàng:"
                  value={filterDataOrder.customer_address}
                />
                <RenderInfoOrder
                  title="Ngày giao hàng:"
                  value={fDateTime(filterDataOrder.delivery_date)}
                />
                <RenderInfoOrder title="Ghi chú:" value={filterDataOrder.note} />
                <RenderInfoOrder
                  title="Yêu cầu hóa đơn:"
                  value={filterDataOrder.request_invoice ? 'Có' : 'Không'}
                />
              </Box>
              {filterDataOrder.user_id && (
                <Box paddingBottom={3} borderBottom="2px dashed rgb(244, 246, 248)" mt={2}>
                  <Typography variant="h5">Thông tin tài khoản đặt hàng</Typography>

                  <RenderInfoOrder title="Tên tài khoản:" value={filterDataOrder.user_name} />
                  <RenderInfoOrder title="Email:" value={filterDataOrder.user_email} />
                  <RenderInfoOrder title="Số điện thoại:" value={filterDataOrder.user_phone} />
                </Box>
              )}
            </Card>
          </Stack>
        </>
      )}
    </Container>
  );
}
