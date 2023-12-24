import { Helmet } from 'react-helmet-async';
import { AppView } from 'src/sections';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Trang chủ | MeatDeli Admin </title>
      </Helmet>

      <AppView />
    </>
  );
}
