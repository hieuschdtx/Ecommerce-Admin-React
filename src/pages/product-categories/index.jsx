import { Helmet } from 'react-helmet-async';
import { ProductCategoriesView } from 'src/sections';

export default function ProductCategoriesPage() {
  return (
    <>
      <Helmet>
        <title>Danh mục sản phẩm | MeatDeli Admin </title>
      </Helmet>
      <ProductCategoriesView />
    </>
  );
}
