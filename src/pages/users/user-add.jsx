import { Helmet } from 'react-helmet-async';

import AddUserPage from 'src/sections/user/view/user-add-view';

export default function AddInfoUserPage() {
  return (
    <>
      <Helmet>
        <title>Add User | MeatDeli Admin </title>
      </Helmet>

      <AddUserPage />
    </>
  );
}
