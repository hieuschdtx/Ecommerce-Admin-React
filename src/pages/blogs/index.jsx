import { Helmet } from 'react-helmet-async';
import { BlogView } from 'src/sections';

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Bài viết | MeatDeli Admin </title>
      </Helmet>

      <BlogView />
    </>
  );
}
