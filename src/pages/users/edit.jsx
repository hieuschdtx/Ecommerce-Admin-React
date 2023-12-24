import { Helmet } from 'react-helmet-async';
import { UserDetailView } from 'src/sections';

export default function EditUserPage() {
  return (
    <>
      <Helmet>
        <title>Chỉnh sửa người dùng | MeatDeli Admin </title>
      </Helmet>

      <UserDetailView isAdd={false} />
    </>
  );
}
