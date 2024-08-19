import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import util from '@/plugins/util';
function AuthRoute({ children }: { children: ReactNode }) {
  const token = util.getCacheToken('token');
  if (token) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace></Navigate>;
  }
}
function LoginRoute({ children }: { children: ReactNode }) {
  const token = util.getCacheToken('token');
  if (token) {
    return <Navigate to="/" replace></Navigate>;
  } else {
    return <>{children}</>;
  }
}

export { AuthRoute, LoginRoute };
