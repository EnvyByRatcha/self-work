import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectRouteProps {
  children: ReactNode;
}

const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decode = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log(currentTime);
    console.log(decode.exp);

    if (!decode.exp) {
      return false;
    }

    return decode.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const ProtectRoute = ({ children }: ProtectRouteProps) => {
  const isAuthenticated = isTokenValid();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectRoute;
