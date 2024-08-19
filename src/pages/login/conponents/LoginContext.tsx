import { createContext } from 'react';
import { LoginType } from '@/dataType';
export interface LoginContextType {
  change: (_num: number) => void;
  loginData: LoginType;
}

export const LoginContext = createContext<LoginContextType>({
  change: () => {},
  loginData: { name: '', password: '' }
});
export default LoginContext;
