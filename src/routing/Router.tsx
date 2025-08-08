import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';

import { ErrorElement } from '~/components';
import { ProtectedRoute } from '~/routing/ProtectedRoute';
import { IRoute, routes } from '~/routing/routes';

const transformRoutes = (routes: IRoute[]): RouteObject[] => {
  return routes.map((route) => {
    const { authRequired, children, errorElement, ...otherProps } = route;

    if (authRequired) {
      return {
        path: route.path,
        element: <ProtectedRoute />,
        children: [
          {
            children: children ? transformRoutes(children) : undefined,
            ...otherProps,
          },
        ],
        errorElement: errorElement ?? <ErrorElement />,
      };
    }

    return {
      children: children ? transformRoutes(children) : undefined,
      errorElement: errorElement ?? <ErrorElement />,
      ...otherProps,
    };
  }) as RouteObject[];
};

const router = createBrowserRouter(transformRoutes(routes));

const Router = () => {
  return <RouterProvider router={router} />;
};

export { Router };
