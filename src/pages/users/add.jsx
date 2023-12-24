import { Helmet } from 'react-helmet-async';
import { UserDetailView } from 'src/sections';

export default function AddUserPage() {
  return (
    <>
      <Helmet>
        <title>Thêm mới người dùng | MeatDeli Admin </title>
      </Helmet>

      <UserDetailView isAdd={true} />
    </>
  );
}
