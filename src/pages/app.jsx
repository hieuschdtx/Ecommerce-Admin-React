import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>Home | MeatDeli Admin </title>
      </Helmet>

      <AppView />
    </>
  );
}
