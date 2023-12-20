import {
  Box,
  Button,
  Container,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import { render } from 'react-dom';
import { useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import { grey } from 'src/theme/palette';
import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 'none',
  p: 3,
  overflowY: 'scroll hidden',
  minHeight: '100vh',
  outline: 'none',
};

const stylePaper = {
  p: 3,
  position: 'absolute',
  overflowY: 'scroll',
  top: 0,
  right: 0,
  bottom: 0,
  width: 1,
};

const RenderInfo = ({ title, value }) => {
  return (
    <Stack
      display="grid"
      gridTemplateColumns={'1fr 3fr'}
      justifyContent="flex-start"
      mt={1}
      ml={10}
    >
      <Typography variant="normal" fontSize={13}>
        {title}
      </Typography>
      <Typography variant="normal" fontSize={13}>
        {value}
      </Typography>
    </Stack>
  );
};

const RenderInfoPrice = ({ title, value }) => {
  return (
    <Stack direction="row" gap={2}>
      <Typography variant="normal" fontSize={14} minWidth={110} textAlign="left" color={grey[800]}>
        {title}
      </Typography>
      <Typography variant="normal" fontSize={14} fontWeight={600} width={110} textAlign="right">
        {value}
      </Typography>
    </Stack>
  );
};

export default function OrderExport({ products, orderSelect, open, handleClose }) {
  const mdUp = useResponsive('up', 'md');
  const { productPrices } = useSelector((x) => x.rootReducer.products);
  const modalRef = useRef(null);

  const handleExportPDF = () => {
    html2canvas(modalRef.current, {
      scrollX: 0,
      scrollY: 0,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      doc.save(`HOADON-${orderSelect.code}.pdf`);
    });
  };

  return (
    <Modal
      sx={{ minHeight: '100vh' }}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container sx={{ ...style, width: '50%' }}>
        <Paper sx={stylePaper}>
          <Stack ref={modalRef} p={2}>
            <Stack width={1} direction="row" justifyContent="space-between" alignItems="center">
              <img alt="" src="/assets/logo.png" width={mdUp ? 170 : 100} />
              <Box display="flex" flexDirection="column">
                <Typography variant="normal" fontSize={20} fontWeight={700}>
                  ĐƠN HÀNG {orderSelect.code}
                </Typography>
                <Typography variant="normal" fontSize={12} fontStyle={'italic'}>
                  Ngày tạo: {fDateTime(new Date())}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" justifyContent="center" mt={2}>
              <Typography variant="normal" fontSize={24} fontWeight={700}>
                HÓA ĐƠN BÁN HÀNG
              </Typography>
            </Stack>
            <RenderInfo title={'Họ tên khách hàng:'} value={orderSelect.customer_name} />
            <RenderInfo title={'Số điện thoại liên hệ:'} value={orderSelect.customer_phone} />
            <RenderInfo title={'Địa chỉ giao hàng:'} value={orderSelect.customer_address} />
            <RenderInfo
              title={'Thời gian giao hàng:'}
              value={fDateTime(orderSelect.delivery_date)}
            />
            <Stack direction="row" justifyContent="flex-start" mt={2}>
              <Typography variant="normal" fontSize={16} fontWeight={600}>
                Chi tiết đơn hàng
              </Typography>
            </Stack>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Chi tiết</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Giá bán&nbsp;(vnđ)</TableCell>
                    <TableCell align="right">Tổng&nbsp;(vnđ)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((item, index) => {
                    const priceProductOrder = productPrices.find(
                      (price) => price.product_id === item.product_id
                    );
                    return (
                      <TableRow
                        key={item.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <Box display="flex" flexDirection="column" gap={0.5} flex="1 1 auto">
                            <Typography variant="normal" fontSize={13} fontWeight={500}>
                              {item.product_name}
                            </Typography>
                            <Typography variant="normal" fontSize={12} color={grey[600]}>
                              {item.pc_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="normal" fontSize={13} fontWeight={500}>
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="normal" fontSize={13} fontWeight={500}>
                            {`${fNumber(priceProductOrder.price_sale)} đ`}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box width={110} textAlign="right">
                            <Typography variant="normal" fontSize={13} fontWeight={500}>
                              {`${fNumber(item.total_amount)} đ`}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack direction="column" gap={2} alignItems={'flex-end'} mt={3}>
              <RenderInfoPrice
                title={'Tạm tính'}
                value={`${fNumber(orderSelect.bill_invoice)} đ`}
              />
              <RenderInfoPrice
                title={'Phí vận chuyển'}
                value={`${orderSelect.is_vat ? fNumber(30000) : 0} đ`}
              />
              <RenderInfoPrice
                title={'Tổng đơn hàng'}
                value={`${
                  orderSelect.is_vat
                    ? fNumber(orderSelect.bill_invoice + 30000)
                    : fNumber(orderSelect.bill_invoice)
                } đ`}
              />
            </Stack>
          </Stack>

          <Stack direction="row" gap={2} justifyContent="flex-end" mt={3}>
            <Button variant="outlined" onClick={handleClose} color="inherit">
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleExportPDF}
              color="inherit"
              startIcon={<Iconify icon="mdi:file-export" />}
            >
              Xuất PDF
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Modal>
  );
}
