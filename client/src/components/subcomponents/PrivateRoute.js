import { useLocation, Navigate } from "react-router-dom";
import checkAuth from "../../helpers/auth";

export const PrivateRoute = ({ children }) => {
  const { pathname } = useLocation();

  return checkAuth() ? (
    children
  ) : (
    <Navigate to='/login' state={{ from: pathname }} replace />
  );
};
