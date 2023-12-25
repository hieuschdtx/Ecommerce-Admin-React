import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blogs'));
export const AddBlogPage = lazy(() => import('src/pages/blogs/add'));
export const EditBlogPage = lazy(() => import('src/pages/blogs/edit'));
export const UserPage = lazy(() => import('src/pages/users'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AddUserPage = lazy(() => import('src/pages/users/add'));
export const EditUserPage = lazy(() => import('src/pages/users/edit'));
export const CategoriesPage = lazy(() => import('src/pages/categories'));
export const ProductCategoriesPage = lazy(() => import('src/pages/product-categories'));
export const PromotionPage = lazy(() => import('src/pages/promotions'));
export const ProductAddPage = lazy(() => import('src/pages/products/add'));
export const ProductEditPage = lazy(() => import('src/pages/products/edit'));
export const OrderPage = lazy(() => import('src/pages/orders'));
export const OrderEditPage = lazy(() => import('src/pages/orders/edit'));

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
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'blog/new', element: <AddBlogPage /> },
        { path: 'blog/:id/edit', element: <EditBlogPage /> },
        { path: 'user/new', element: <AddUserPage /> },
        { path: 'user/:id/edit', element: <EditUserPage /> },
        { path: 'category', element: <CategoriesPage /> },
        { path: 'product-category', element: <ProductCategoriesPage /> },
        { path: 'promotion', element: <PromotionPage /> },
        { path: 'products/new', element: <ProductAddPage /> },
        { path: 'products/:id/edit', element: <ProductEditPage /> },
        { path: 'order', element: <OrderPage /> },
        { path: 'order/:id/edit', element: <OrderEditPage /> },
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
