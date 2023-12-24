import { Helmet } from 'react-helmet-async';
import { CategoriesView } from 'src/sections';

export default function CategoriesPage() {
  return (
    <>
      <Helmet>
        <title>Danh mục | MeatDeli Admin </title>
      </Helmet>
      <CategoriesView />
    </>
  );
}
