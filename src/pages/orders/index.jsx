import { Helmet } from 'react-helmet-async';
import { OrdersView } from 'src/sections';

export default function OrderPage() {
  return (
    <>
      <Helmet>
        <title>Đơn hàng | MeatDeli Admin </title>
      </Helmet>
      <OrdersView />
    </>
  );
}
