import { Helmet } from 'react-helmet-async';
import { BlogDetailPage } from 'src/sections';

export default function AddNewsPage() {
  return (
    <>
      <Helmet>
        <title>Thêm mới bài viết | MeatDeli Admin </title>
      </Helmet>

      <BlogDetailPage isAdd={true} />
    </>
  );
}
