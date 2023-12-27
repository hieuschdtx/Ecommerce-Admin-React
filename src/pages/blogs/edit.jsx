import { Helmet } from 'react-helmet-async';
import { BlogDetailPage } from 'src/sections';

export default function EditNewsPage() {
  return (
    <>
      <Helmet>
        <title>Chỉnh sửa bài viết | MeatDeli Admin </title>
      </Helmet>

      <BlogDetailPage isAdd={false} />
    </>
  );
}
