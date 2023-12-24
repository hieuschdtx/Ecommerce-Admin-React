import { Helmet } from 'react-helmet-async';
import { ProductsView } from 'src/sections';

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Sản phẩm | MeatDeli Admin</title>
      </Helmet>

      <ProductsView />
    </>
  );
}
