import { Helmet } from 'react-helmet-async';
import { ProductAdd } from 'src/sections';

export default function ProductEditPage() {
  return (
    <>
      <Helmet>
        <title> Edit Product | MeatDeli </title>
      </Helmet>
      <ProductAdd isAdd={false} />
    </>
  );
}
