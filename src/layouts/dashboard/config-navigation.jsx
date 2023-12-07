import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <Iconify icon={name} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Thống kê',
    path: '/',
    icon: icon('fa:dashboard'),
  },
  {
    title: 'Danh mục',
    path: '/category',
    icon: icon('tabler:category-filled'),
  },
  {
    title: 'Danh mục sản phẩm',
    path: '/product-category',
    icon: icon('dashicons:products'),
  },
  {
    title: 'Sản phẩm',
    path: '/products',
    icon: icon('fa6-brands:product-hunt'),
  },
  {
    title: 'Khuyến mãi',
    path: '/promotion',
    icon: icon('foundation:burst-sale'),
  },
  {
    title: 'Tài khoản',
    path: '/user',
    icon: icon('solar:user-bold'),
    disabled: true,
  },
  {
    title: 'Bài viết',
    path: '/blog',
    icon: icon('dashicons:welcome-write-blog'),
  },
  {
    title: 'Đăng xuất',
    path: '/logout',
    icon: icon('clarity:logout-solid'),
  },
];

export default navConfig;
