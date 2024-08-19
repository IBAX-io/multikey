import Routes from './routes';
import { createBrowserRouter } from 'react-router-dom';
import NoMatch from '@/pages/noMatch/NoMatch';
import MainLayout from '@/pages/layout/MainLayout';
import { AuthRoute, LoginRoute } from '@/router/AuthRoute';
import Login from '@/pages/login/Login';

const AllRoutes = [
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
    title: '',
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
    children: [...Routes]
  }
];
const Router = createBrowserRouter(AllRoutes as any);
export default Router;
