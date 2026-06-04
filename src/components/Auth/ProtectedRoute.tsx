import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasAuthTokens } from "../../utils/authStorage";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!hasAuthTokens()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
