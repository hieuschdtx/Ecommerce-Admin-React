import { useEffect, useState } from 'react';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import ThemeProvider from 'src/theme';
import { connection } from './utils/signalR';
import 'react-toastify/dist/ReactToastify.css';
import ToastMessage from './components/toast/toast';
import Router from './routes/sections';
import { useRouter } from './routes/hooks';
import { auth } from './utils/auth';

// ----------------------------------------------------------------------

const App = () => {
  const router = useRouter();
  useScrollToTop();

  const [connections, setConnections] = useState(null);

  useEffect(() => {
    setConnections(connection);
  }, []);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (connections) {
      connections.start().then(() => {
        console.log('Connected to SignalR hub.');
      });

      return () => {
        connections.stop();
        console.log('Disconnected from SignalR hub');
      };
    }
  }, [connections]);

  useEffect(() => {
    const isAuthenticated = auth.CheckExprise();
    const hasAccess = auth.GetAccess();

    if (!(isAuthenticated && hasAccess)) {
      console.log('Tài khoản không có quyền truy cập hoặc đã hết phiên làm việc');
      router.push('/login');
    }
  }, [router]);

  return (
    <ThemeProvider>
      <Router />
      <ToastMessage />
    </ThemeProvider>
  );
};

export default App;
