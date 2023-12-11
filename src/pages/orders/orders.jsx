import { Helmet } from 'react-helmet-async';
import { OrdersView } from 'src/sections/oders/view';

export default function OrderPage() {
  return (
    <>
      <Helmet>
        <title>Orders | MeatDeli Admin </title>
      </Helmet>
      <OrdersView />
    </>
  );
}
