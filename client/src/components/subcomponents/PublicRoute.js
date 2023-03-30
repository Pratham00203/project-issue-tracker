import { useLocation, Navigate } from "react-router-dom";
import checkAuth from "../../helpers/auth";

export const PublicRoute = ({ children }) => {
  const { pathname } = useLocation();

  return !checkAuth() ? (
    children
  ) : (
    <Navigate to='/projects/dashboard' state={{ from: pathname }} replace />
  );
};
