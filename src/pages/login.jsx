import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRouter } from 'src/routes/hooks';

import { LoginView } from 'src/sections/login';
import { auth } from 'src/utils/auth';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = auth.CheckExprise();
    if (isAuthenticated) router.push('/');
  }, [router]);

  return (
    <>
      <Helmet>
        <title>Login | MeatDeli Admin </title>
      </Helmet>

      <LoginView />
    </>
  );
}
