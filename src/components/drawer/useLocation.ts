import { matchRoutes, useLocation } from 'react-router-dom';

const routes = [{ path: '/members/:id' }];

export const useCurrentPath = () => {
  const location = useLocation();
  const ress = matchRoutes(routes, location);
  console.log('🚀 ~ file: useLocation.ts:8 ~ useCurrentPath ~ ress:', ress);

  return ress;
};
