import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  email: string;
  exp: number;
  [key: string]: any;
}

const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const getEmail = (): string | null => {
  const decode = getDecodedToken();
  return decode?.email || null;
};
