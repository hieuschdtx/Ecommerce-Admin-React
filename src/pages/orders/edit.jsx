import { Helmet } from 'react-helmet-async';
import OrderDetail from 'src/sections/oders/view/orders-detail';

export default function OrderEditPage() {
  return (
    <>
      <Helmet>
        <title>Orders edit | MeatDeli Admin </title>
      </Helmet>
      <OrderDetail />
    </>
  );
}
