import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../../hook/useAuthStatus';

import Spinner from './Spinner';

const PrivateRoute = () => {
  const { loggedIn, status } = useAuthStatus();
  if (status) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
