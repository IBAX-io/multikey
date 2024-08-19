import Home from '@/pages/home/Home';
import MainLayout from '@/pages/layout/MainLayout.tsx';
import Login from '@/pages/login/Login';
import NoMatch from '@/pages/noMatch/NoMatch';
import { AuthRoute, LoginRoute } from '@/router/AuthRoute';
import { lazy } from 'react';
const handleLazy = (name: string) => {
  const Comp = lazy(() => import(`../pages/${name}`));
  return <Comp />;
};
const config = [
  {
    path: '*',
    element: <NoMatch />,
    title: 'No Match',
    meta: {
      key: '0'
    }
  },
  {
    path: '/login',
    element: (
      <LoginRoute>
        <Login />
      </LoginRoute>
    ),
    title: 'logon',
    meta: {
      key: '1'
    }
  },
  {
    path: '/',
    element: (
      <AuthRoute>
        <MainLayout />
      </AuthRoute>
    ),
    title: '',
    meta: {
      key: '2'
    },
    children: [
      {
        index: true,
        element: <Home />,
        title: 'Home',
        meta: {
          key: '3'
        }
      },
      {
        path: '/manage',
        title: 'nav.manage',
        // Single route in lazy file
        element: handleLazy('manage/Manage'),
        meta: {
          key: '4'
        }
      },
      {
        path: '/colorSystem',
        element: handleLazy('system/ColorSystem'),
        title: 'nav.colorSystem',
        meta: {
          key: '5'
        }
      }
    ]
  }
];

export default config;
