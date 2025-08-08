import { Navigate, RouteObject } from 'react-router-dom';

export interface IRoute extends Omit<RouteObject, 'children'> {
  authRequired?: boolean;
  children?: IRoute[];
}

export enum NavRoutes {
  HOME = '/',
  AUTH = '/auth',
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
}

export const routes: IRoute[] = [
  {
    path: NavRoutes.HOME,
    authRequired: true,
    lazy: () => import('~/layouts/Main'),
    children: [
      {
        index: true,
        lazy: () => import('~/modules/Main/pages/Home'),
      },
    ],
  },
  {
    path: NavRoutes.AUTH,
    lazy: () => import('~/layouts/Auth'),
    children: [
      {
        index: true,
        element: <Navigate to={NavRoutes.LOGIN} />,
      },
      {
        path: NavRoutes.LOGIN,
        lazy: () => import('~/modules/Auth/pages/Login'),
      },
      {
        path: NavRoutes.REGISTER,
        lazy: () => import('~/modules/Auth/pages/Register'),
      },
    ],
  },
];
