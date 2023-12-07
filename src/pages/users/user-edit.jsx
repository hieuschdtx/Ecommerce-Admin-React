import { Helmet } from 'react-helmet-async';

import UserDetailView from 'src/sections/user/view/user-detail-view';

export default function EditInfoUserPage() {
  return (
    <>
      <Helmet>
        <title>Edit User | MeatDeli Admin </title>
      </Helmet>

      <UserDetailView isAdd={false} />
    </>
  );
}
