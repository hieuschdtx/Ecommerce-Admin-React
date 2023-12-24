import { Helmet } from 'react-helmet-async';
import { OrderDetail } from 'src/sections';

export default function OrderEditPage() {
  return (
    <>
      <Helmet>
        <title>Chỉnh sửa đơn hàng | MeatDeli Admin </title>
      </Helmet>
      <OrderDetail />
    </>
  );
}
