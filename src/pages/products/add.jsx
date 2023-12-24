import { Helmet } from 'react-helmet-async';
import { ProductAdd } from 'src/sections';

export default function ProductAddPage() {
  return (
    <>
      <Helmet>
        <title> Add Product | MeatDeli </title>
      </Helmet>
      <ProductAdd isAdd />
    </>
  );
}
