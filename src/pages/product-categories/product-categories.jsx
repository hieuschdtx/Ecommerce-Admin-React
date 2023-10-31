import { Helmet } from 'react-helmet-async';
import { ProductCategoriesView } from 'src/sections/product-categories/view';

export default function ProductCategories() {
  return (
    <>
      <Helmet>
        <title>Product Categories | MeatDeli Admin </title>
      </Helmet>
      <ProductCategoriesView />
    </>
  );
}
