import { Helmet } from 'react-helmet-async';
import { UserView } from 'src/sections';

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>Người dùng | MeatDeli Admin </title>
      </Helmet>

      <UserView />
    </>
  );
}
