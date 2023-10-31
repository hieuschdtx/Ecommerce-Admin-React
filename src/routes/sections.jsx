import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes, useNavigate } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import { auth } from 'src/utils/auth';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/users/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AddInfoUserPage = lazy(() => import('src/pages/users/user-add'));
export const CategoryPage = lazy(() => import('src/pages/categories/categories'));

// ----------------------------------------------------------------------

export const RequireAuth = (WrappedComponent) => {
  const ComponentWithAuth = () => {
    const cavigate = useNavigate();
    const isAuthenticated = auth.CheckExprise();
    const hasAccess = auth.GetAccess();

    useEffect(() => {
      if (!isAuthenticated) {
        cavigate('/login');
      }
      if (hasAccess) {
        alert('Tài khoản không có quyền truy cập vào trang Admin');
      }
    }, [isAuthenticated, hasAccess, cavigate]);

    return isAuthenticated && hasAccess ? <WrappedComponent /> : null;
  };
  return ComponentWithAuth;
};

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'user/new', element: <AddInfoUserPage /> },
        { path: 'category', element: <CategoryPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
