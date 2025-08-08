import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export { ProtectedRoute };
