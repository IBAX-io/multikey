import MainLayout from '@/pages/layout/MainLayout';
import Login from '@/pages/login/Login';
import ErrorMatch from '@/pages/noMatch/ErrorMatch';
import NoMatch from '@/pages/noMatch/NoMatch';
import { AuthRoute, LoginRoute } from '@/router/AuthRoute';
import { createBrowserRouter } from 'react-router-dom';
import Routes from './routes';

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
    path: '/error',
    element: <ErrorMatch />,
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
    errorElement: <NoMatch />,
    title: '',
    meta: {
      key: '2'
    },
    children: [...Routes]
  }
];
const Router = createBrowserRouter(AllRoutes as any);
export default Router;
