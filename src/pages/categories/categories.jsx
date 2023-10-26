import { Helmet } from 'react-helmet-async';
import { CategoriesView } from 'src/sections/categories/view';

export default function Categories() {
  return (
    <>
      <Helmet>
        <title>Categories | MeatDeli Admin </title>
      </Helmet>
      <CategoriesView />
    </>
  );
}
