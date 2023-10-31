import { Helmet } from 'react-helmet-async';
import ProductCategoriesView from 'src/sections/product-categories';

export default function ProductCategories() {
  <>
    <Helmet>
      <title>Product Categories | MeatDeli Admin </title>
    </Helmet>
    <ProductCategoriesView />
  </>;
}
